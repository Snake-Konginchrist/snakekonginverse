# SnakeKonginVerse 开发模式调试指南

这份文档说明如何在本机启动、调试和停止 SnakeKonginVerse。
项目是 Next.js 16.3.8 + React 19.3 + Payload CMS 3.90.2 + PostgreSQL，使用 pnpm 管理依赖；类型检查使用 TypeScript 7，代码规范检查使用 Oxlint。
前台和 Payload 管理后台运行在同一个 Next.js 开发进程中。

## 一、准备开发环境

项目要求：

- Node.js `>=22.13.0`；
- pnpm `10.8.0`；
- 本机 PostgreSQL；
- 一个只供开发使用的数据库，例如 `snakekonginverse`。

先确认版本：

```bash
node --version
pnpm --version
psql --version
```

如果 pnpm 版本不同，优先使用项目声明的版本：

```bash
pnpm self-update 12.9.1
```

不要把生产数据库连接写进本机开发环境。开发模式会允许 Payload 自动同步 schema，连接生产数据库可能造成不可逆的数据结构变化。

## 二、第一次启动

以下命令都在项目根目录执行：

```bash
# 先在项目根目录执行后续命令
pnpm install --frozen-lockfile
createdb snakekonginverse
cp .env.example .env
```

如果数据库已经存在，`createdb` 报“database already exists”可以忽略，不要删除已有数据库。

编辑 `.env`，至少确认这些值：

```dotenv
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@127.0.0.1:5432/snakekonginverse
PAYLOAD_SECRET=这里放随机长字符串
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MEDIA_DIR=./media
```

可以使用下面的命令生成 Payload 密钥，然后把输出复制到 `.env`：

```bash
openssl rand -hex 32
```

不要把真实 `.env` 提交到 Git。项目的 `.gitignore` 已经忽略 `.env` 和 `media/`。

## 三、生成 Payload 文件并启动

第一次启动或修改 Payload 配置后，先生成类型和后台导入映射：

```bash
pnpm cms:types
pnpm cms:importmap
```

然后初始化缺失的首页、关于页和站点设置：

```bash
pnpm seed
```

`pnpm seed` 是幂等的，只补缺失内容，并为未改动的初始页面补齐尚未编辑的语言。
已有标题、区块或草稿的语言不会覆盖；修改过的页面请在后台自行填写各语言内容。
不会创建测试管理员或虚构作品。

启动开发服务器：

```bash
pnpm dev
```

项目脚本实际执行的是：

```text
next dev --hostname 127.0.0.1
```

看到 `Ready` 后打开：

- 前台：<http://localhost:3000>
- Payload 后台：<http://localhost:3000/admin>
- REST API：<http://localhost:3000/api>
- 草稿预览：登录后台后从页面或作品编辑器进入预览

首次进入 `/admin` 时创建自己的管理员帐号。当前没有配置真实邮件服务，密码找回邮件不会投递。

## 四、日常开发循环

大多数情况下只需要：

```bash
pnpm dev
```

修改 `src/` 下的 TypeScript、React 或 CSS 文件后，浏览器会通过 Next.js Fast Refresh 更新。
如果修改了 Payload 的集合、字段、权限或全局配置，执行：

```bash
pnpm cms:types
pnpm cms:importmap
```

开发环境中的 Payload 配置会启用 schema 自动同步：

```ts
push: process.env.NODE_ENV !== 'production';
```

因此本机开发一般不需要手动执行迁移。修改完成并准备部署时，再创建并审阅迁移：

```bash
pnpm db:migration
```

不要在开发阶段把自动同步当成生产迁移流程；生产环境必须使用版本化迁移。

## 五、前台调试

前台主要代码在这些位置：

```text
src/app/(site)/              前台路由、SEO、预览页
src/components/              Header、Footer、内容卡片等组件
src/components/blocks/       页面区块渲染器
src/lib/content.ts           Payload 服务端查询封装
src/styles/                  设计令牌、布局和内容样式
```

页面内容来自 PostgreSQL，不是写死在 React 页面里。调试首页时可以按这个顺序检查：

1. 浏览器打开 `/admin`，确认“页面搭建”中 `/` 页面已发布；
2. 检查首页区块是否包含品牌首屏、探索入口等区块；
3. 打开浏览器开发者工具的 Console 和 Network，查看是否有请求失败；
4. 回到运行 `pnpm dev` 的终端查看 Payload 或 Next.js 错误堆栈；
5. 修改内容后刷新页面，确认公开页面只读取已发布内容。

调试 API 时可以先做只读请求：

```bash
curl -i http://127.0.0.1:3000/api/pages?limit=1
curl -i http://127.0.0.1:3000/api/entries?limit=1
```

草稿不能通过公开 API 返回。管理员写入操作应从 Payload 后台执行，不要把管理员 token 写进前端代码或提交到仓库。

## 六、Payload 后台调试

后台内容模型与权限定义在：

```text
src/cms/collections.ts       Users、Media、Pages、Entries
src/cms/site-settings.ts     站点设置
src/cms/blocks.ts             页面区块字段
src/cms/fields.ts             SEO、路径和链接校验
src/cms/access.ts             登录用户与公开访问权限
src/payload.config.ts         Payload、PostgreSQL、Lexical 配置
```

常用调试动作：

- 页面访问地址冲突：检查 `Pages.path` 是否已经被使用，且不要使用 `/admin`、`/api`、`/preview` 等保留路径；
- 页面发布后不显示：确认状态是 `published`，不是草稿；
- 图片上传失败：确认 `MEDIA_DIR` 存在且当前用户可写，文件类型是 JPEG、PNG、WebP 或 AVIF，大小不超过 10 MB；
- 富文本编辑器异常：重新执行 `pnpm cms:importmap`，然后重启 `pnpm dev`；
- 字段类型提示不更新：重新执行 `pnpm cms:types`，确认 `src/payload-types.ts` 已更新；
- 权限异常：检查 `src/cms/access.ts`，不要通过 `overrideAccess: true` 绕过公开读取权限。

开发时查看本地数据库结构或数据：

```bash
psql "$DATABASE_URL"
```

进入 psql 后可以使用：

```sql
\dt
\d pages
\d entries
SELECT id, title, path, _status FROM pages ORDER BY id;
SELECT id, title, slug, kind, _status FROM entries ORDER BY id;
```

只读排查优先使用 `SELECT`。删除或批量修改数据前先确认数据库名称和目标记录，避免误操作其他项目。

## 七、查看日志与处理常见问题

开发服务器的实时日志就在执行 `pnpm dev` 的终端。不要只看浏览器的“页面打不开”，同时查看终端完整错误堆栈。

### 端口 3000 已被占用

先找出占用进程：

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

优先停止之前启动的开发服务。需要临时换端口时，可以直接运行：

```bash
pnpm dev -- --port 3001
```

这时访问 <http://localhost:3001>，并确保 `NEXT_PUBLIC_SITE_URL` 与实际访问地址一致。

### 数据库连接失败

逐项检查：

```bash
pg_isready
psql "$DATABASE_URL" -c 'select current_database(), current_user;'
```

确认 PostgreSQL 正在运行、数据库存在、用户名和密码已 URL 编码，并且 `.env` 位于项目根目录。
不要把密码直接打印到聊天、日志或 Git diff 中。

### 页面显示空状态

这是预期行为：前台只显示已发布内容，不会把示例数据伪装成真实作品。
进入 `/admin` 发布对应的作品、创作或手记，刷新前台后再确认。

### 修改没有生效

先确认保存的是当前项目根目录，再依次尝试：

```bash
pnpm cms:types
pnpm cms:importmap
```

然后在运行开发服务的终端按 `Ctrl+C` 停止，再重新执行 `pnpm dev`。
如果是数据库内容问题，检查 Payload 后台的状态、路径和数据库查询结果。

## 八、停止和重新启动

停止当前开发服务：

```text
在运行 pnpm dev 的终端按 Ctrl+C
```

重新启动：

```bash
pnpm dev
```

不要用 `kill -9` 作为第一选择。只有确认普通停止无效，并且已经通过 `lsof` 找到明确的项目进程时，才处理残留进程。

## 九、开发前的轻量检查

你说后续会手动测试时，可以只做这些不启动浏览器的检查：

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm check:lines
```

完整检查命令 `pnpm check` 还会执行单元测试。浏览器回归测试需要已经运行的开发服务：

```bash
pnpm test:e2e
```

CMS 真实闭环验证会创建并清理临时帐号、内容和媒体，仅建议在专用本地数据库执行：

```bash
pnpm test:cms
```

手动调试时可以不运行这些自动化命令；但提交代码前，至少确认 `pnpm dev` 能启动、首页能打开、后台能登录。

## 十、开发数据库重置边界

本项目没有提供“一键删除开发数据库”的脚本，避免误删其他环境数据。
如果确实要重建本地开发库，先确认当前连接的数据库名称：

```bash
psql "$DATABASE_URL" -c 'select current_database();'
```

确认是本地 `snakekonginverse` 后，停止开发服务，再由你手动删除并重新创建数据库，然后执行：

```bash
pnpm seed
pnpm dev
```

生产数据库、服务器媒体目录和任何真实内容都不应使用这套重建流程。
