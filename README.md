# SnakeKonginVerse

Snake + Kongin + Verse。Snake Konginchrist 的技术、同人创作与个人品牌网站。
通过官方 `create-next-app` 在现有根目录初始化，前台与 Payload 后台同仓部署。

## 技术栈

Next.js 16.3.5、React 19.3、TypeScript 严格模式、Tailwind CSS 4.3、Payload CMS 3.90.1、Lexical、PostgreSQL、本地媒体存储。
使用 pnpm、ESLint、Prettier、Node 测试与 Playwright；部署采用 Node.js + systemd + Nginx，无 Docker。
具体版本以 lockfile 为准，GraphQL 保持在 Payload 支持的 16.x。

## 本地运行

需要 Node.js 22.13+（推荐受支持的 LTS）、pnpm 10.8.0 和 PostgreSQL。

```bash
pnpm install --frozen-lockfile
cp .env.example .env
createdb snakekonginverse
# 编辑 .env 的数据库连接，用 openssl rand -hex 32 生成 PAYLOAD_SECRET
pnpm cms:types
pnpm cms:importmap
pnpm seed
pnpm dev
```

本次初始化已经准备本机 `.env`、独立数据库及初始页面，不要重复覆盖 `.env`。

- 前台：<http://localhost:3000>
- 后台：<http://localhost:3000/admin>，首次访问创建你自己的管理员。
- 健康检查：`curl -I http://localhost:3000`。
- 停止服务：在运行终端按 `Ctrl+C`。

`pnpm seed` 只补缺失的品牌页面，不覆盖编辑内容，不创建帐号或虚构作品。
开发模式自动同步数据库 schema，生产使用版本化迁移，不能在生产库运行 dev。

## 内容管理

1. **站点设置**：修改品牌、简介、导航、社交链接和强调色。
2. **页面搭建**：设置 `/`、`/about`、`/lab/notes` 等路径，添加区块并拖动排序。
3. **作品与文章**：选择技术项目、同人创作或文字手记，编辑封面、标签与正文。
4. 保存草稿后使用预览按钮查看，发布后前台下一次请求即可读取。
5. **媒体库**：支持 JPEG / PNG / WebP / AVIF，最大 10 MB，必须填写图片描述。

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

本次已验证：生产构建、3 项 URL 边界测试、桌面／手机 4 项浏览器用例（开发与生产模式）、
CMS 登录→草稿→预览→发布、媒体上传、中文后台编辑器，以及空数据库首次迁移。
验证结束后，数据库只保留 2 个初始页面，没有测试管理员、作品或媒体。

- [架构说明](docs/ARCHITECTURE.md)
- [原生服务器部署](docs/DEPLOYMENT.md)
- [版本记录](CHANGELOG.md)

首次开放公网前先创建管理员。当前未配置邮件投递，找回密码邮件不会真实发送。
统计、评论、搜索、自动 URL 重定向和更丰富的区块尚未接入，详见版本记录。
