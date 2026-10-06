# Ubuntu 原生部署（无 Docker）

浏览器 → 可选 Cloudflare → Nginx HTTPS → Node.js 127.0.0.1:3000 → PostgreSQL。
以下以 `/var/www/snakekonginverse`、系统用户 `ubuntu` 和域名 `snakekongin.com` 为例。请替换数据库密码。

## 环境与目录

安装受支持的 Node.js LTS（22.13+）、pnpm 12.9.1、PostgreSQL 和 Nginx。
数据库只监听本机，为本站建立专属非超级用户。

```bash
sudo install -d -o ubuntu -g ubuntu /var/www/snakekonginverse
sudo -u postgres createuser --pwprompt snakekongin
sudo -u postgres createdb --owner=snakekongin snakekonginverse_db
```

将代码部署到项目目录，推荐使用 ubuntu 用户安装和构建，保证其可写 `.next`。

## 配置与首次运行

在根目录创建 `.env`，由运行用户拥有，权限 `chmod 600 .env`：

```dotenv
NODE_ENV=production
DATABASE_URL=postgresql://snakekongin:URL_ENCODED_PASSWORD@127.0.0.1:5432/snakekonginverse_db
PAYLOAD_SECRET=REPLACE_WITH_OPENSSL_RAND_HEX_32
NEXT_PUBLIC_SITE_URL=https://snakekongin.com
R2_BUCKET=snakekonginverse-media
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
```

密码特殊字符需 URL 编码。不要提交真实密钥。以下命令在项目根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm r2:check
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

停止：`sudo systemctl stop snakekonginverse`。服务只需写 `.next` 与 systemd 分配的 SWC 缓存，媒体保存在 R2。

## Nginx 与 HTTPS

将 `deploy/snakekongin.com.conf` 安装为 `/etc/nginx/conf.d/snakekongin.com.conf`；配置已包含 `snakekongin.com` 和 `www.snakekongin.com`。
执行 `sudo nginx -t` 后 `sudo systemctl reload nginx`。
示例先提供 HTTP。用服务器现有证书流程或 Certbot 配置 HTTPS，验证后将 HTTP 重定向至 HTTPS。
Cloudflare 使用 Full (strict)，不要 Flexible，不要缓存 `/admin`、`/api`、`/preview` 或管理员会话。

## 更新与备份

推送到 `main` 后自动更新服务器的配置见 [GitHub Actions 自动部署](AUTO_DEPLOYMENT.md)。

更新前备份数据库与 R2 对象，停服务后更新代码，再执行：

```bash
pnpm install --frozen-lockfile
pnpm r2:check
NODE_ENV=production pnpm db:migrate
NODE_ENV=production pnpm seed
pnpm build
sudo systemctl start snakekonginverse
curl -I http://127.0.0.1:3000
```

定时使用 `pg_dump -Fc` 备份数据库，同时备份 R2 对象与安全保存的环境配置。R2 配置及迁移步骤见 [R2 接入](R2_STORAGE.md)。
恢复时数据库、媒体和迁移版本应匹配。本机代码检查不能证明远端服务器、TLS 和 R2 读写成功，须分别验证。
