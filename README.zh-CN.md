# Snake Konginverse

[English](README.md) | [简体中文](README.zh-CN.md)

Snake Konginchrist（斯黄）的个人主页，展示产品、研究、小说、创作与个人记录，也可作为多语言个人网站模板进行定制。

**[在线站点](https://snakekongin.com) · [模板定制](docs/CUSTOMIZATION.md) · [开发指南](DEVELOPMENT.md) · [版本记录](CHANGELOG.md)**

## 功能

- **个人主页**：首页、实践、求索、创作、行记和关于页面，包含项目展示、社交入口与联系方式。
- **内容管理**：Payload CMS 后台，支持作品与文章、可组合页面、草稿、认证预览和版本历史。
- **小说阅读**：封面书架、书籍目录、章节导航，支持 Markdown、GFM 表格和 LaTeX 公式；可从本地批量导入章节。
- **十种语言**：默认英文，按浏览器语言自动匹配，也支持手动选择并保存偏好。内容翻译由作者维护，小说保留原文。
- **阅读体验**：响应式布局、深浅色主题、键盘焦点与跳转正文入口。
- **自托管**：PostgreSQL、Cloudflare R2，以及 Node.js + systemd + Nginx 部署；可配置 GitHub Actions 自动发布。
- **可选统计**：Microsoft Clarity 和 Google Analytics 4，未配置时不加载。

当前不提供站内搜索、评论、公众注册、自动 URL 重定向或邮件投递。未配置邮件适配器时，找回密码邮件只写入服务端日志。

## 技术栈

Next.js 16.4.5、React 19.3、TypeScript 7、Tailwind CSS 4.3、Payload CMS 3.93.0、Lexical、PostgreSQL 和 Cloudflare R2。使用 pnpm、Oxlint、Prettier 与 Playwright。

依赖版本以 `package.json` 和 `pnpm-lock.yaml` 为准；GraphQL 保持在 Payload 支持的 16.x。

## 快速开始

### 环境要求

- Node.js `^22.23.4 || >=24.22.1`。
- pnpm `12.9.1`。
- PostgreSQL 数据库及具有建表权限的数据库用户。
- Cloudflare R2 存储桶和仅授权该桶的对象读写凭据。本地开发同样需要 R2 配置。

### 安装与配置

```bash
git clone https://github.com/Snake-Konginchrist/snakekonginverse.git
cd snakekonginverse
pnpm install --frozen-lockfile
cp .env.example .env
```

在 PostgreSQL 中创建数据库，例如 `createdb snakekonginverse_db`，并在 `.env` 中填写实际用户、密码和库名。数据库名与用户名可自行选择；特殊字符密码需要 URL 编码。

| 配置                                                                   | 用途                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                                                         | PostgreSQL 连接地址                                                       |
| `PAYLOAD_SECRET`                                                       | CMS 密钥，可使用 `openssl rand -hex 32` 生成                              |
| `R2_BUCKET`、`R2_ENDPOINT`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY` | 媒体存储，详见 [R2 配置](docs/R2_STORAGE.md)                              |
| `APP_HOST`、`APP_PORT`                                                 | 本地监听地址和端口，示例为 `127.0.0.1:3000`                               |
| `NEXT_PUBLIC_SITE_URL`                                                 | 网站访问地址，本地为 `http://localhost:3000`，部署时填写自己的 HTTPS 域名 |
| `CLARITY_PROJECT_ID`、`GA4_MEASUREMENT_ID`                             | 可选统计标识                                                              |

保留已有环境文件中的实际配置；真实 `.env` 不应提交到仓库。

### 初始化与启动

```bash
pnpm r2:check
pnpm cms:types
pnpm cms:importmap
pnpm db:migrate
pnpm seed
pnpm dev
```

打开 [网站](http://localhost:3000) 或 [管理后台](http://localhost:3000/admin)。首次访问后台创建管理员，开放公网前完成此步骤。

`pnpm seed` 补充初始页面与站点设置，不创建管理员或示例作品；重复运行会保留已经编辑的内容。首页与关于页使用代码维护的品牌布局，定制这些页面请参阅 [模板定制指南](docs/CUSTOMIZATION.md)。

开发和生产默认均使用版本化迁移。只有显式设置 `PAYLOAD_DB_PUSH=true` 才启用 schema push，这个选项仅用于可丢弃的开发数据库。

## 使用与定制

后台管理作品、文章、自定义页面、媒体、小说及章节。自定义页面可使用 `/lab/notes` 等路径，固定栏目与管理路由由系统保留。公开访问只读取已发布内容，草稿预览需要管理员会话。

复用模板时，先替换品牌、个人资料、社交账号、十种语言文案与图片，再配置自己的数据库、R2 和域名。仓库自带的是作者个人站点内容，不会在安装时自动替换为使用者资料。

- [模板定制指南](docs/CUSTOMIZATION.md)：品牌、文案、页面、图片与配置位置。
- [小说导入指南](docs/NOVELS.md)：一章一个 Markdown 文件，生成稳定清单并批量导入。
- [开发与调试](DEVELOPMENT.md)：本地运行、数据库迁移和常见问题。
- [贡献指南](CONTRIBUTING.md)：改动范围、生成文件与验证要求。

## 常用命令

```bash
pnpm dev             # 开发服务；Ctrl+C 停止
pnpm check           # Lint、类型、单元测试与手写文件行数检查
pnpm format:check    # 格式检查
pnpm build           # 生产构建
pnpm start           # 运行生产构建，需事先配置环境并完成迁移
```

浏览器测试需要已启动的网站：

```bash
pnpm exec playwright install chromium
TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e
TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:cms
pnpm test:novels
```

CMS 与小说集成验证会写入临时数据库记录及 R2 对象，并在结束时清理；请使用专用开发环境。

## 部署与维护

- [Ubuntu 原生部署](docs/DEPLOYMENT.md)
- [GitHub Actions 自动部署](docs/AUTO_DEPLOYMENT.md)
- [Cloudflare R2](docs/R2_STORAGE.md)
- [Clarity 与 GA4](docs/ANALYTICS.md)
- [架构说明](docs/ARCHITECTURE.md)
- [对象存储额度参考](docs/OBJECT_STORAGE.md)，保留原查询日期，实际额度以厂商为准。

部署示例中的域名、路径、账户和存储桶名称均需按自己的环境调整。媒体由 R2 持久化，数据库、媒体和环境文件需要一起备份。

`patches/payload@3.93.0.patch` 修复关闭内容语言回退时，未指定语言的 REST 请求没有采用默认语言的问题。`pnpm install` 自动应用补丁；升级 Payload 时应验证相关回归，再决定是否移除。

## 支持作者

如果这个项目对你有所帮助，欢迎通过 [Ko-fi](https://ko-fi.com/snake_konginchrist) 或 [Buy Me a Coffee](https://www.buymeacoffee.com/snakekongin) 支持后续开发与创作。

## 星标历史

[![Star History Chart](https://api.star-history.com/svg?repos=Snake-Konginchrist/snakekonginverse&type=Date)](https://www.star-history.com/#Snake-Konginchrist/snakekonginverse&Date)

## 许可证

本项目采用 [GNU General Public License v3.0](LICENSE)（`GPL-3.0-only`）。

Copyright (C) 2026 Snake Konginchrist.

第三方依赖与素材遵循各自的许可证和授权声明。
