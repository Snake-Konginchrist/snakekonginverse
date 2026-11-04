# 架构与开发约定

```text
src/app/(site)/        前台路由、SEO、认证预览
src/i18n/              next-intl 路由、语言切换与消息加载
messages/              英语、简体中文、繁体中文、日语、韩语、西班牙语、法语、德语、葡萄牙语、俄语消息
src/app/(payload)/     官方后台视图和 REST 适配
src/cms/               集合、权限、字段校验、区块 schema
src/components/        按职责拆分的展示组件
src/components/blocks/ 区块渲染
src/lib/content.ts     服务端查询边界
src/styles/            配色令牌、布局、品牌与阅读样式
src/migrations/        官方生成的数据库迁移
src/payload-types.ts   自动生成类型
scripts/               初始化和代码检查
tests/                 边界测试和浏览器回归
deploy/                原生部署配置
```

## 数据边界

`lib/content.ts` 封装公开读取，显式设置 `overrideAccess: false`，避免 Payload Local API 默认绕过权限。
React `cache` 仅用于单请求去重，不长期缓存 CMS 内容，发布后下一请求可见。
数据库故障不降级为假数据。

Pages 保存 URL、SEO 和区块布局；Entries 保存独立的作品与文章，以 kind 区分栏目。
共同的草稿、封面、标签、正文只定义一次。未来产品、经历有不同业务字段时再拆集合。
Pages 支持多级路径，数据库唯一约束避免冲突，系统栏目与管理路由不可占用。
首页和关于页使用代码维护的品牌布局与翻译文案；自定义 Pages 与其草稿预览共用区块渲染。翻译文件不会覆盖已编辑的 CMS 正文。

Novels 与 Chapters 保存小说元信息和 Markdown 章节。公开章节同时受书籍与章节发布状态约束；封面复用 Media 和 R2。
修改 URL 当前不会自动保留 301，需要在后续内容迁移时配置重定向。

Pages 和 Entries 使用 Payload 草稿与版本历史。预览验证请求 Cookie 中的管理员会话，
以当前用户查询 draft；普通访问始终只读取 published。
后台仅供管理员使用，不提供公众注册或多级审核角色。
媒体公开可读，不要上传私有附件。

## 单域名信息架构

前台保持一个域名，公开 URL 不带语言前缀；内部根据用户手动选择或浏览器语言匹配到本地化路由，默认英语。`/` 是个人介绍首页，`/projects`、
`/research`、`/creations`、`/journal` 和 `/about` 是同一站点下的栏目。小说目录使用 `/creations/novels/[book]`，章节追加 `/[chapter]`。自定义 Pages 可使用未被系统保留的路径。

首页与关于页的个人介绍、项目目录和社交展示由源码维护；具体定制文件见 [模板定制](CUSTOMIZATION.md)。

## 设计系统

前台以纸色背景、深色正文和红色强调的品牌布局为主，支持浅色与深色主题。具体颜色、CMS 强调色与字体以 `src/styles/tokens.css` 和组件样式为准。
字体通过本地依赖打包，前台与后台使用独立根布局。保留键盘焦点、跳转正文、语义标题和 reduced-motion 支持。

## 扩展约定

新增区块：定义 CMS schema → 生成类型 → 新建展示组件 → 注册 renderer → 生成迁移 → 验证前后台。
不要把数据查询、UI、路由和样式堆到同一文件。手写文件限 300 行，中文注释解释边界与设计原因。
自动生成文件不人为拆分，不通过压缩长行规避限制。

生产只监听回环地址，Nginx 提供 HTTPS。媒体由 R2 持久化，并与 PostgreSQL 一起备份。
邮件、统计、社交链接需要真实配置，默认不伪造。
