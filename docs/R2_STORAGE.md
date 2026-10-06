# Cloudflare R2 媒体存储

本网站在 Node.js 中使用 Cloudflare R2 的 S3 兼容接口：

- AWS 官方 SDK：`@aws-sdk/client-s3`。
- Payload 官方存储适配器：`@payloadcms/storage-s3`，版本与 Payload 保持一致。
- `@payloadcms/storage-r2` 适用于 Cloudflare Workers 的原生绑定，不适用于当前 systemd / Node.js 部署。

[Cloudflare SDK 官方示例](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/)、
[Payload 官方接入说明](https://payloadcms.com/docs/upload/storage-adapters#using-with-cloudflare-r2-via-s3-api)。

## 配置

本地开发及服务器都只使用 R2，不回退到本地媒体目录。
项目根目录 `.env` 中配置以下字段，模板见 `.env.example`：

```dotenv
R2_BUCKET=snakekonginverse-media
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
```

密钥来自 R2 专用令牌；权限选“对象读和写”，仅授权 `snakekonginverse-media`。
`R2_ENDPOINT` 使用创建令牌后显示的 S3 Endpoint，不是公开文件域名，不能包含存储桶路径。
使用辖区限制的桶应填写该辖区专用 Endpoint。
SDK 的 `region` 固定为 `auto`，使用 path-style 寻址。
真实 `.env` 权限应为 `600`，不要提交 Git，也不要发送到聊天或输出日志。

填写完成后执行：

```bash
pnpm r2:check
pnpm dev
```

连接预检检查配置及存储桶可访问性；上传、下载、删除权限还需通过真实媒体操作验证。
应用初始化会检查必填配置，缺少 R2 参数时明确报错。
生成类型或迁移只处理 schema，不要求访问 R2。

## 文件访问

存储桶保持私有，无需开启 `r2.dev`、配置公共域名或浏览器 CORS。
管理员上传图片到 CMS，由服务器将原图和 card 缩略图上传到 R2。
前台通过 `/api/media/file/文件名` 访问，由官方适配器读取 R2 并返回文件。
公开读取、管理员写入仍沿用 CMS 的权限设置；密钥只在服务端使用。
文件下载经过网站服务器，仍会消耗网站服务器带宽；没有启用 R2 公共域名直连或 CDN 分发。
当前只允许 JPEG、PNG、WebP、AVIF 图片，单文件上限 10 MB；未开放视频上传或视频转码。

## 生产切换

1. 填好真实 R2 参数并完成连接、上传和下载验证。
2. 将四个 `R2_*` 字段安全写入服务器 `/var/www/snakekonginverse/.env`，保留原数据库及 Payload 配置。
3. 安装更新后的 systemd 配置并执行 `sudo systemctl daemon-reload`，服务不再需要本地媒体目录写入权限。
4. 部署本次代码，执行生产迁移，为媒体表增加官方适配器的 `_objectKey` 字段。
5. 检查网站、后台上传、缩略图、下载和删除，确认当前发布使用 R2。

不要把本机完整 `.env` 覆盖到服务器，本机数据库连接和站点地址与生产不同。
未准备 R2 参数时，部署会在停止旧服务之前失败，不会切换当前发布。
如有旧媒体，必须先将原图及缩略图按原文件名迁入 R2，再切换服务；禁止直接删除旧文件。
2026-10-06 接入时核对本地及生产数据库的媒体记录均为 0，无既有媒体需要搬迁。

## 部署备份

自动部署停止应用写入后，备份数据库及 R2 桶内所有对象。
R2 对象备份保存在 `.deploy/backups/发布标识/r2/`，这只是备份副本，网站不从这里读取媒体。
文件使用 key 的 SHA-256 作为备份名称，`manifest.json` 记录原对象 key、类型、元信息及文件映射。
备份读取使用 ETag 条件校验，过程中对象变化会使备份失败，避免把不匹配的对象当作成功备份。
大桶的完整备份会增加停机时间、存储空间和请求用量；自动部署默认保留最近 7 份备份，需要按媒体增长情况调整策略。
备份目前仍在同一台服务器，还应安排异地副本与恢复演练。
