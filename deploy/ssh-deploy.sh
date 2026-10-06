#!/usr/bin/env bash
set -Eeuo pipefail

for name in DEPLOY_HOST DEPLOY_PORT DEPLOY_USER DEPLOY_PATH DEPLOY_SERVICE \
  DEPLOY_HEALTH_URL DEPLOY_SSH_KEY DEPLOY_KNOWN_HOSTS GITHUB_SHA; do
  [[ -n ${!name:-} ]] || { echo "缺少 GitHub 部署配置：$name" >&2; exit 1; }
done
[[ $DEPLOY_HOST =~ ^[a-zA-Z0-9._-]+$ && $DEPLOY_HOST != -* ]]
[[ $DEPLOY_USER =~ ^[a-zA-Z0-9_-]+$ && $DEPLOY_USER != -* ]]
[[ $DEPLOY_PORT =~ ^[0-9]+$ && $DEPLOY_PORT -ge 1 && $DEPLOY_PORT -le 65535 ]]
[[ $DEPLOY_PATH =~ ^/[a-zA-Z0-9_./-]+$ && $DEPLOY_PATH != / && $DEPLOY_PATH != *..* ]]
[[ $DEPLOY_SERVICE =~ ^[a-zA-Z0-9_-]+(\.service)?$ ]]
[[ $DEPLOY_HEALTH_URL =~ ^http://127\.0\.0\.1:[0-9]+/[a-zA-Z0-9/_-]+$ ]]
[[ $GITHUB_SHA =~ ^[a-f0-9]{40}$ ]]

umask 077
local_tmp=$(mktemp -d)
remote_tmp=''
ssh_args=(-i "$local_tmp/key" -p "$DEPLOY_PORT" -o BatchMode=yes
  -o StrictHostKeyChecking=yes -o UserKnownHostsFile="$local_tmp/known_hosts"
  -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=10)
target="$DEPLOY_USER@$DEPLOY_HOST"
cleanup() {
  if [[ -n $remote_tmp ]]; then
    ssh "${ssh_args[@]}" "$target" "rm -rf -- '$remote_tmp'" || true
  fi
  rm -rf -- "$local_tmp"
}
trap cleanup EXIT
printf '%s\n' "$DEPLOY_SSH_KEY" > "$local_tmp/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$local_tmp/known_hosts"
unset DEPLOY_SSH_KEY DEPLOY_KNOWN_HOSTS
ssh-keygen -y -f "$local_tmp/key" > /dev/null
remote_tmp=$(ssh "${ssh_args[@]}" "$target" 'umask 077; mktemp -d /tmp/snakeverse-deploy.XXXXXXXX')
[[ $remote_tmp =~ ^/tmp/snakeverse-deploy\.[a-zA-Z0-9]+$ ]]
git archive --format=tar "$GITHUB_SHA" | gzip > "$local_tmp/source.tar.gz"
scp -i "$local_tmp/key" -P "$DEPLOY_PORT" -o BatchMode=yes \
  -o StrictHostKeyChecking=yes -o UserKnownHostsFile="$local_tmp/known_hosts" \
  "$local_tmp/source.tar.gz" deploy/server-deploy.sh "$target:$remote_tmp/"
ssh "${ssh_args[@]}" "$target" \
  "bash '$remote_tmp/server-deploy.sh' '$remote_tmp/source.tar.gz' '$DEPLOY_PATH' '$DEPLOY_SERVICE' '$GITHUB_SHA' '$DEPLOY_HEALTH_URL'"
