# 模板定制

Snake Konginverse 同时是作者实际运行的个人网站。复用时，需要将代码中的个人资料与视觉素材替换为自己的内容，并使用独立的数据库和对象存储。

## 定制位置

| 内容                                       | 文件或入口                                                      |
| ------------------------------------------ | --------------------------------------------------------------- |
| 品牌、作者、默认语言、导航默认值和上传限制 | `src/config/site.json`                                          |
| 个人资料、项目链接和研究介绍               | `src/data/profile.ts`                                           |
| 社交账号、链接和品牌图标                   | `src/data/socials.ts`                                           |
| 首页、关于页、栏目标题、页脚及界面文案     | `messages/*.json`                                               |
| 首页布局                                   | `src/components/ideal-home.tsx`                                 |
| 关于页与固定栏目布局                       | `src/app/(site)/[locale]/[[...path]]/page.tsx`                  |
| 页头、页脚、项目和社交展示                 | `src/components/` 中对应组件                                    |
| 栏目头图与说明配置                         | `src/config/section-heroes.json`                                |
| 静态图片与站点图标                         | `public/images/`、`src/app/icon.svg`                            |
| 颜色、字体和主题                           | `src/styles/tokens.css`、前台 `layout.tsx`                      |
| CMS 默认标签与社交平台排序                 | `src/config/cms-labels.json`、`src/config/social-audience.json` |
| 数据库、媒体、网站地址和统计               | `.env`，参考 `.env.example`                                     |

`site.json` 既被前台直接读取，也用于初始化设置。例如品牌名称由代码配置统一，因此只在后台修改品牌并不能替代源码中的品牌定制。导航和站点设置的显示逻辑请同时检查页头、页脚组件。

## 建议顺序

复用模板时，替换 README 中的打赏链接和 `.github/FUNDING.yml` 中的 GitHub Sponsor 账号。

1. 替换品牌、作者资料、邮箱、QQ、微信、社交账号和项目链接。
2. 修改十种语言中的个人文案，保持消息键一致；修改 `messages/en.json` 后同步其他语言。
3. 替换头图、封面、图标和插画，确认各尺寸裁切及深浅色效果。
4. 配置自己的 `.env`，创建独立数据库与 R2 存储桶，然后执行迁移和初始化。
5. 在后台添加作品、文章、小说及需要的自定义页面，检查草稿和发布状态。
6. 配置自己的生产域名、部署用户和 GitHub Actions Secrets，运行检查与构建。

初始内容由 `scripts/starter-pages.ts`、`scripts/seed-settings.ts` 和翻译文件共同维护。已经编辑的 CMS 内容不会因修改翻译文件自动重写；需要在后台修改对应语言。

## 页面与内容边界

首页 `/` 和关于页 `/about` 使用固定品牌布局；后台 Pages 适合维护其他自定义路径。Entries 管理实践、求索、创作与行记中的独立作品或文章。

小说使用独立的 Novels 和 Chapters 集合。界面随访客语言切换，小说正文保持作者写作语言；导入步骤见 [小说指南](NOVELS.md)。

公开 URL 不带语言前缀。访客已保存的选择优先，其次是浏览器语言，最后使用默认英文。增加语言时，需要同时调整语言配置、词典和数据库中相关的 locale 枚举迁移。

## 上线检查

确认页面中已替换作者账号和默认图像，`NEXT_PUBLIC_SITE_URL` 指向自己的 HTTPS 域名，管理员已创建，R2 上传与读取正常。访问统计默认留空，启用方式见 [统计说明](ANALYTICS.md)。

现有代码只接入 R2。若要使用其他对象存储，需要调整存储适配器、环境校验与备份脚本，不能只替换桶名。
