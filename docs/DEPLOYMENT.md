# Ubuntu 原生部署（无 Docker）

浏览器 → 可选 Cloudflare → Nginx HTTPS → Node.js 127.0.0.1:3000 → PostgreSQL。
以下以 `/var/www/snakekonginverse`、系统用户 `snakeverse` 和域名 `snakekongin.com` 为例。请替换数据库密码。

## 环境与目录

安装受支持的 Node.js LTS（22.13+）、pnpm 12.9.1、PostgreSQL 和 Nginx。
数据库只监听本机，为本站建立专属非超级用户。

```bash
sudo adduser --system --group --home /var/lib/snakekonginverse snakeverse
sudo install -d -o snakeverse -g snakeverse /var/www/snakekonginverse
sudo install -d -o snakeverse -g snakeverse /var/lib/snakekonginverse/media
sudo -u postgres createuser --pwprompt snakeverse
sudo -u postgres createdb --owner=snakeverse snakekonginverse
```

将代码部署到项目目录，推荐使用 snakeverse 用户安装和构建，保证其可写 `.next`。

## 配置与首次运行

在根目录创建 `.env`，由运行用户拥有，权限 `chmod 600 .env`：

```dotenv
NODE_ENV=production
DATABASE_URL=postgresql://snakeverse:URL_ENCODED_PASSWORD@127.0.0.1:5432/snakekonginverse
PAYLOAD_SECRET=REPLACE_WITH_OPENSSL_RAND_HEX_32
NEXT_PUBLIC_SITE_URL=https://snakekongin.com
MEDIA_DIR=/var/lib/snakekonginverse/media
```

密码特殊字符需 URL 编码。不要提交真实密钥。以下命令在项目根目录执行：

```bash
pnpm install --frozen-lockfile
NODE_ENV=production pnpm db:migrate
NODE_ENV=production pnpm seed
pnpm check
pnpm build
pnpm start
```

首次部署使用仓库初始迁移，不能依赖开发模式自动 push。
后续 schema 变更在本机执行 `pnpm db:migration`，审阅 SQL 后提交迁移，先在测试库验证。

## 创建管理员

开放公网前，通过 `ssh -L 3000:127.0.0.1:3000 YOUR_SERVER` 建立隧道，
访问本机 `http://localhost:3000/admin` 创建管理员。完成后停止手动服务，改用 systemd。
未配置邮件 adapter，密码找回邮件只记入日志，不会发送。

## systemd

```bash
sudo cp deploy/snakekonginverse.service /etc/systemd/system/
# 根据 command -v node 修改 ExecStart 路径，并确认用户、项目目录。
sudo systemctl daemon-reload
sudo systemctl enable --now snakekonginverse
sudo systemctl status snakekonginverse
journalctl -u snakekonginverse -f
curl -I http://127.0.0.1:3000
```

停止：`sudo systemctl stop snakekonginverse`。服务仅可写媒体目录与 `.next` 缓存。

## Nginx 与 HTTPS

将 `deploy/snakekongin.com.conf` 安装为 `/etc/nginx/conf.d/snakekongin.com.conf`；配置已包含 `snakekongin.com` 和 `www.snakekongin.com`。
执行 `sudo nginx -t` 后 `sudo systemctl reload nginx`。
示例先提供 HTTP。用服务器现有证书流程或 Certbot 配置 HTTPS，验证后将 HTTP 重定向至 HTTPS。
Cloudflare 使用 Full (strict)，不要 Flexible，不要缓存 `/admin`、`/api`、`/preview` 或管理员会话。

## 更新与备份

推送到 `main` 后自动更新服务器的配置见 [GitHub Actions 自动部署](AUTO_DEPLOYMENT.md)。

更新前备份数据库与媒体，停服务后更新代码，再执行：

```bash
pnpm install --frozen-lockfile
NODE_ENV=production pnpm db:migrate
NODE_ENV=production pnpm seed
pnpm build
sudo systemctl start snakekonginverse
curl -I http://127.0.0.1:3000
```

定时使用 `pg_dump -Fc` 备份数据库，同时备份媒体目录与安全保存的环境配置。
恢复时数据库、媒体和迁移版本应匹配。远端服务器、TLS 与 Cloudflare 不属于此次本机验证范围。
