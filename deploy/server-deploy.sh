#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
archive=${1:?缺少代码归档}
app=${2:?缺少网站目录}
service=${3:?缺少服务名}
revision=${4:?缺少提交版本}
health=${5:?缺少本机健康检查地址}
[[ $app =~ ^/[a-zA-Z0-9_./-]+$ && $app != / && $app != *..* ]]
[[ $service =~ ^[a-zA-Z0-9_-]+(\.service)?$ ]]
[[ $revision =~ ^[a-f0-9]{40}$ ]]
[[ $health =~ ^http://127\.0\.0\.1:[0-9]+/[a-zA-Z0-9/_-]+$ ]]
[[ -d $app && -f $app/.env && -f $archive ]]
if [[ -f $app/.deploy/runtime.env ]]; then
  # 服务端一次性准备的可信运行路径，使 nvm 安装也可用于非交互 SSH。
  set -a
  source "$app/.deploy/runtime.env"
  set +a
fi
for command in node pnpm pg_dump tar flock curl sudo systemctl; do
  command -v "$command" > /dev/null || { echo "服务器缺少 $command" >&2; exit 1; }
done
root="$app/.deploy"
[[ $(systemctl show "$service" --property=WorkingDirectory --value) == "$root/current" ]] || {
  echo 'systemd WorkingDirectory 与部署目录不一致。' >&2; exit 1;
}
[[ $(systemctl show "$service" --property=User --value) == "$(id -un)" ]] || {
  echo '请使用运行网站的系统用户进行部署。' >&2; exit 1;
}
sudo -n -l /usr/bin/systemctl stop "$service" > /dev/null
sudo -n -l /usr/bin/systemctl start "$service" > /dev/null
mkdir -p "$root/releases" "$root/backups"
exec 9> "$root/deploy.lock"
flock -w 1800 9
stamp="$(date -u +%Y%m%dT%H%M%SZ)-${revision:0:12}-$$"
release="$root/releases/$stamp"
backup="$root/backups/$stamp"
mkdir -p "$release" "$backup/env"
tar -xzf "$archive" -C "$release" --no-same-owner
[[ -f $release/package.json && -f $release/deploy/runtime-config.mjs ]]
# 所有实际环境文件均来自服务器；归档不能提供或覆盖这些配置。
for filename in "$app"/.env "$app"/.env.*; do
  [[ -f $filename && $(basename "$filename") != .env.example ]] || continue
  cp -L -- "$filename" "$backup/env/"
  cp -L -- "$filename" "$release/"
done
export NODE_ENV=production
cd "$release"
pnpm install --frozen-lockfile
node deploy/runtime-config.mjs run "$app" exec node deploy/r2-storage.mjs check
pnpm exec next typegen
pnpm check
pnpm build

stopped=0
migration_started=0
finish() {
  code=$?
  if (( code != 0 )); then
    echo "部署失败，保留配置、数据库备份和发布目录：$backup" >&2
    if (( stopped && !migration_started )); then
      sudo -n /usr/bin/systemctl start "$service" || true
    elif (( migration_started )); then
      echo '迁移阶段已开始：不自动回退数据库或启动旧代码，请检查日志及备份。' >&2
    fi
  fi
}
trap finish EXIT
sudo -n /usr/bin/systemctl stop "$service"
stopped=1
node deploy/runtime-config.mjs backup "$app" "$backup/database.dump"
node deploy/runtime-config.mjs run "$app" exec node deploy/r2-storage.mjs backup "$backup/r2"
printf '%s\n' "$revision" > "$release/DEPLOYED_COMMIT"
migration_started=1
node deploy/runtime-config.mjs run "$app" db:migrate --yes
node deploy/runtime-config.mjs run "$app" seed

# 原有代码和环境文件保持原位，新版本在专用目录构建并切换。
if [[ -L $root/current ]]; then
  printf '%s\n' "$(readlink -f "$root/current")" > "$backup/previous-release"
fi
ln -s -- "$release" "$root/current-next"
mv -Tf -- "$root/current-next" "$root/current"
sudo -n /usr/bin/systemctl start "$service"
health_base="http://127.0.0.1:$(node -e 'console.log(new URL(process.argv[1]).port)' "$health")"
health_paths=("" "projects" "research" "about")
for attempt in {1..30}; do
  healthy=1
  if ! systemctl is-active --quiet "$service"; then
    healthy=0
  else
    for health_path in "${health_paths[@]}"; do
      status=$(curl --silent --show-error --max-time 5 --output /dev/null --write-out '%{http_code}' "$health_base/$health_path") || status=000
      if [[ $status != 200 ]]; then
        healthy=0
        echo "健康检查未通过：/$health_path HTTP $status" >&2
      fi
    done
  fi
  if (( healthy )); then
    echo "部署成功：$revision"
    exit 0
  fi
  sleep 2
done
echo '新版本未通过健康检查，部署标记为失败。' >&2
systemctl status "$service" --no-pager || true
journalctl -u "$service" -n 40 --no-pager || true
exit 1
