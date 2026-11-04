# 小说与 Markdown 导入

小说独立于原有作品与文章。创作页自动展示已发布小说及封面，书籍页提供章节目录，阅读页提供前后章导航。支持 GFM Markdown、`$x^2$` 行内公式和 `$$` 块公式；原始 HTML 不执行，KaTeX 不开启可信命令。小说保持原文语言，界面随站点语言切换。

## 部署

先备份数据库，然后在现有部署流程中运行 `pnpm db:migrate`。新增迁移仅新增小说、章节及版本表和后台锁关联字段；不改写原有作品。不要在正式数据上使用 schema push。迁移回滚会删除新小说表，请先导出小说数据。此功能不会自动执行迁移。

## 导入一本书

每本书一个文件夹，章节文件按数字排序，例如 `001 序章.md`、`002 初遇.md`。封面放在同一文件夹内。

```bash
pnpm import:novels ./我的小说 --init
```

生成 `novel.json`，默认以文件夹名作为书名。编辑清单的 `title`、`description`、`language`，添加 `"cover": "cover.jpg"`。清单的章节数组顺序就是目录顺序；每章可单独指定 `title`，否则读取开头的一级标题或文件名。开头一级标题会作为阅读页标题，不在正文重复显示。

书籍 ID 类似 `n-8b73a9212fa149a0`，章节 ID 类似 `c-0001`。它们不包含中文或拼音。保留清单和 ID：修改文件名时只改 `file`，新增章节时添加一项并使用新的 ID；不要复用已删除章节的 ID。

```bash
pnpm import:novels ./我的小说 --dry-run
export NOVEL_SITE_URL=https://example.com
# NOVEL_TOKEN 使用现有管理员通过 POST /api/users/login 获取的短期 JWT
# 请在本地安全设置环境变量，不要提交 token 或密码到 Git
pnpm import:novels ./我的小说
# 确认后直接发布小说与本次导入的章节
pnpm import:novels ./我的小说 --publish
```

默认导入为草稿，已发布章节的新修改会保存为草稿版本。重复导入按小说 ID 和章节 ID 更新，不产生重复章节，不删除清单外章节。封面首次导入上传到现有 R2 媒体库；后续换封面在后台完成，避免重复上传。无封面时展示以真实书名排版的封面。

导入会先验证全部本地文件，再通过 Payload REST API 逐章写入。中途网络失败可能已成功导入前几章；修复后用同一清单重跑即可。它不是整本书事务。远程地址必须 HTTPS；本机 localhost 可用 HTTP。Markdown 中本地图片不会自动上传，请使用媒体库提供的公开图片地址。

多个书籍文件夹可以依次执行同一导入命令，每本书维护独立清单。

## 地址和接口

- 书架：`/creations`
- 小说目录：`/creations/novels/n-8b73a9212fa149a0`
- 章节：`/creations/novels/n-8b73a9212fa149a0/c-0001`
- 管理 API：`/api/novels`、`/api/chapters`，使用 `Authorization: JWT <token>`。
- 新增使用 POST，更新使用 PATCH `/api/chapters/<数据库ID>`。

写入需要现有管理员认证。匿名读取仅开放已发布小说的已发布章节；小说转为草稿后，其章节也不能通过公开 API 访问。

## 本机集成验证

先完成迁移并启动本机网站，再运行 `pnpm test:novels`（默认 `http://127.0.0.1:3000`，可用 `TEST_BASE_URL` 指定本机地址）。脚本使用 `.env` 的数据库和 R2 配置，创建独立临时管理员、小说、三章 Markdown 和封面，实际调用导入 CLI。验证重复导入、章节顺序、草稿隔离、发布、公式、封面读取及访问权限后，自动删除本次创建的记录、版本和 R2 文件。

`pnpm test:novels --hold` 会在验证通过后保留测试小说，方便人工检查书架、目录、阅读页和手机布局；检查完成后按回车清理。验证报告保存在被 Git 忽略的 `test-results/novels/api-report.json`，不要在生产环境运行集成验证。
