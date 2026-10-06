# SnakeKonginVerse

Snake + Kongin + Verse。Snake Konginchrist 的产品、研究、创作与个人记录网站。
通过官方 `create-next-app` 在现有根目录初始化，前台与 Payload 后台同仓部署。

## 技术栈

对象存储选型与免费额度：[平台对照文档](docs/OBJECT_STORAGE.md)。

Next.js 16.3.8、React 19.3、TypeScript 7 严格模式、Tailwind CSS 4.3、Payload CMS 3.90.2、Lexical、PostgreSQL、Cloudflare R2 媒体存储。
使用 pnpm、Oxlint、Prettier、Node 测试与 Playwright；部署采用 Node.js + systemd + Nginx，无 Docker。
具体版本以 lockfile 为准，GraphQL 保持在 Payload 支持的 16.x。

## 本地运行

需要 Node.js 22.13+（推荐受支持的 LTS）、pnpm 12.9.1 和 PostgreSQL。

```bash
pnpm install --frozen-lockfile
cp .env.example .env
createdb snakekonginverse_db
# 编辑 .env 的数据库连接，用 openssl rand -hex 32 生成 PAYLOAD_SECRET
# 填写 R2_BUCKET、R2_ENDPOINT、R2_ACCESS_KEY_ID、R2_SECRET_ACCESS_KEY
pnpm r2:check
pnpm cms:types
pnpm cms:importmap
pnpm seed
pnpm dev
```

本次初始化已经准备本机 `.env`、独立数据库及初始页面，不要重复覆盖 `.env`。生产环境域名为 `https://snakekongin.com`，部署时将 `NEXT_PUBLIC_SITE_URL` 设置为该地址。
前台使用一个域名，支持英语（默认）、简体中文、繁体中文、日语、韩语、西班牙语、法语、德语、葡萄牙语和俄语。公开路径不带语言前缀，例如 `/projects`、`/about`。首次访问会按浏览器语言选择受支持的语言，未匹配时使用英语；用户也可以通过页头切换语言，选择会保存在浏览器中并优先使用。
内容页包括 `/projects`、`/creations`、`/journal`、`/about`，资料与社交功能页包括
`/links`、`/recommendations`、`/communities`、`/contact`、`/identities`、`/changelog`、`/discussion`。
首页保持个人主页的密度，详细内容和公开入口在对应页面与页脚展开。

- 前台：<http://localhost:3000>
- 后台：<http://localhost:3000/admin>，首次访问创建你自己的管理员。
- 健康检查：`curl -I http://localhost:3000`。
- 停止服务：在运行终端按 `Ctrl+C`。

`pnpm seed` 只补缺失的品牌页面，并为未改动的初始页面补齐尚未编辑的语言，不覆盖编辑内容，不创建帐号或虚构作品。
开发模式自动同步数据库 schema，生产使用版本化迁移，不能在生产库运行 dev。

## 内容管理

1. **站点设置**：修改品牌、简介、导航、社交链接和强调色。
2. **页面搭建**：设置 `/`、`/about`、`/lab/notes` 等路径，添加区块并拖动排序。
3. **作品与文章**：选择技术项目、同人创作或文字手记，编辑封面、标签与正文。
4. 保存草稿后使用预览按钮查看，发布后前台下一次请求即可读取。
5. **媒体库**：支持 JPEG / PNG / WebP / AVIF，最大 10 MB，必须填写图片描述。

图片及缩略图上传到私有 R2 存储桶，通过 CMS 同源文件接口读取；不需要开启存储桶公开访问。
本地开发同样使用 R2，缺少配置时不会回退本地文件。SDK 与接入步骤见 [R2 配置](docs/R2_STORAGE.md)。

首版提供品牌首屏、探索入口、个人宣言、富文本、内容列表五种区块。
这是结构化区块编辑器，不是任意拖动像素的画布。
所有公开内容查询都启用权限检查；草稿预览要求管理员登录。媒体 URL 公开可读。

## 工程检查

```bash
pnpm check          # Lint、类型、URL 边界测试、手写文件行数检查
pnpm format:check
pnpm build
pnpm start          # 先构建并完成迁移
pnpm test:e2e       # 需要已启动网站和 Playwright Chromium
pnpm test:cms       # 本机真实 CMS 闭环；临时帐号、内容和媒体自动清理
```

首次安装浏览器：`pnpm exec playwright install chromium`。
修改 schema 后执行 `pnpm cms:types && pnpm cms:importmap`，然后生成迁移。
手写代码不超过 300 行；生成的类型、导入映射、数据库迁移和 lockfile 不人为拆分。

Payload 的 Pages 与 Entries 支持以上十种语言；初始化脚本为内置页面和站点设置提供对应文案，不会自动翻译已有自定义内容，
社交目录使用 `react-icons` 的品牌图标。未确认的社交账号只显示为待配置入口，避免生成错误链接。

- [架构说明](docs/ARCHITECTURE.md)
- [开发模式调试指南](DEVELOPMENT.md)
- [原生服务器部署](docs/DEPLOYMENT.md)
- [Clarity 与 GA4 配置](docs/ANALYTICS.md)
- [Cloudflare R2 接入](docs/R2_STORAGE.md)
- [对象存储免费额度对照](docs/OBJECT_STORAGE.md)
- [版本记录](CHANGELOG.md)

首次开放公网前先创建管理员。当前未配置邮件投递，找回密码邮件不会真实发送。
评论、搜索、自动 URL 重定向和更丰富的区块尚未接入，详见版本记录。
