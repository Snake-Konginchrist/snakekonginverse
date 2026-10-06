# 网站访问统计

前台接入 Microsoft Clarity 和 Google Analytics 4：

- Clarity：微软官方 `@microsoft/clarity` SDK，延迟在浏览器初始化。
- GA4：Next.js 官方 `@next/third-parties` 的 `GoogleAnalytics` 组件，加载 Google tag。
- 仅生产环境的前台布局启用，Payload 管理后台不加载统计。
- 直接打开草稿预览不初始化统计；已加载统计的浏览器会话不提供 SDK 停止功能，预览建议使用独立窗口。

## 环境配置

在本地或服务器 `.env` 的“访问统计”分组填写：

```dotenv
CLARITY_PROJECT_ID=
GA4_MEASUREMENT_ID=
```

Clarity 项目 ID 在 [Clarity 控制台](https://clarity.microsoft.com/) 的项目设置中查找。
GA4 的衡量 ID 在 [Google Analytics](https://analytics.google.com/) → 管理 → 数据流 → 网站数据流中查找，格式为 `G-XXXXXXXXXX`。
这些是公开统计标识，不是 API 密钥；不需要账户密码或服务端访问令牌。
留空时不加载对应统计，开发模式不发送访问数据。
值从服务器布局传给浏览器，修改生产 `.env` 后需重启服务。

GA4 使用自动页面浏览统计，不重复手动发送 page_view。
在 GA4 数据流设置中启用增强型衡量，并确认开启基于浏览器历史变化的页面浏览。

## 验证

填写真实 ID 后，用生产构建访问前台，检查 Clarity 脚本及 Google tag 的网络请求，再分别查看 Clarity 项目和 GA4 实时报告。
编译和类型检查通过只能证明接入代码有效，不能证明平台已经收到数据。
当前实现没有同意管理界面，若需要按访客同意控制统计，需另行接入同意管理。

## 官方资料

- [Microsoft Clarity 官方 NPM 接入说明](https://clarity.microsoft.com/blog/npm-integration/)
- [Next.js Google Analytics 接入说明](https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics)
- [Google Analytics 自动衡量](https://support.google.com/analytics/answer/9216061)
