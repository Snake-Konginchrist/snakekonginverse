# 对象存储免费额度对照

查询日期：2026-10-06。额度和活动会调整，开通前以官方页面及账户控制台为准。
免费存储不代表访问免费：存储容量、请求、下载流量、CDN 和媒体处理可能分别计费。

## 当前网站方案

项目默认使用 Cloudflare R2；其他平台的额度仅作原查询日期的参考，切换适配器需修改代码：

- 存储桶：`snakekonginverse-media`，通过 `.env` 中的 `R2_*` 字段配置。
- PostgreSQL 保存文件元信息，Payload CMS 管理上传文件。
- 图片和缩略图上传到 R2；自动部署在发布前备份 R2 对象。
- 当前单文件上传上限为 10 MB，没有视频转码或流媒体处理服务。

## 免费额度对照

| 平台                                                     | 免费存储                             | 请求和流量                                                      | 期限及条件                                                             |
| -------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Cloudflare R2](https://www.cloudflare.com/products/r2/) | 标准存储 10 GB-month/月              | 每月 100 万次 A 类、1,000 万次 B 类操作；出站流量免费           | 每月额度；不适用于低频访问存储                                         |
| [Backblaze B2](https://www.backblaze.com/cloud-storage)  | 前 10 GB 免费                        | 免费出站流量为月均存储量的 3 倍，超额收费；请求费用需查官方明细 | 持续免费存储额度                                                       |
| [Supabase Storage](https://supabase.com/storage)         | Free 套餐 1 GB 文件存储              | 下载流量有套餐额度，不能按无限免费流量理解                      | Free 套餐，另受套餐限制                                                |
| [七牛云 Kodo](https://www.qiniu.com/products/kodo)       | 标准存储 10 GB/月                    | CDN 回源流出 10 GB/月；PUT/DELETE 10 万次/月；GET 100 万次/月   | 开通服务并实名认证，每月发放，不结转                                   |
| [腾讯云 COS](https://cloud.tencent.com/product/cos)      | 个人 50 GB，企业 1 TB 标准存储容量   | 免费容量包不抵扣请求和流量费用                                  | 首次开通 COS，180 天；不适用于金融云地域                               |
| [阿里云 OSS](https://www.aliyun.com/product/oss)         | 新用户标准本地冗余存储 20 GB         | 另含下行流量包 2 GB、请求包 20 万次                             | 3 个月；实名认证且未开通 OSS，通过试用入口领取                         |
| [Google Cloud Storage](https://cloud.google.com/storage) | 每月 5 GB-month 区域存储             | 每月 5,000 次 A 类、50,000 次 B 类操作；100 GB 北美出站流量     | 仅 us-east1、us-west1、us-central1；免费出站目的地不包含中国和澳大利亚 |
| [AWS S3](https://aws.amazon.com/s3/)                     | 新账户试用金可抵扣符合条件的 S3 使用 | 注册获得 100 美元，完成指定活动可再获最高 100 美元              | 新账户免费计划最长 6 个月，不是长期免费的固定 S3 容量                  |

`GB-month` 是容量与存储时间的计量单位，例如持续存放 10 GB、存满一个月约为 10 GB-month。
A 类和 B 类包含的操作按平台定义，不能将不同平台的额度直接当成同一种请求比较。

## 需要特别注意

### 七牛云

CDN HTTP 每个区域另有 10 GB/月免费额度。网站使用 HTTPS，不能把这项 HTTP 优惠当作 HTTPS 免费流量。
对象存储、CDN 回源和 CDN 对访客的分发是不同计费项。
测试域名创建 30 个自然日后自动回收，正式网站需要配置自己的访问域名。

### 阿里云

官方另列有指定地域每月 5 GB 标准本地冗余存储免费额度，可与符合条件的新用户试用叠加。
指定地域包含中国香港、日本东京、新加坡和部分其他海外地域，不包含中国大陆地域；具体资格及地域列表以官方文档为准。
存储额度不等于同等容量的免费外网下载流量。

### 公开图片和视频

频繁下载时，流量和读请求可能比存储本身更影响费用。
对象存储可以保存视频原文件，但视频转码、缩略图、图片处理和 CDN 可能是单独收费的服务。
免费额度超出后可能自动计费，开通时应核对付款要求、计费规则和用量提醒。

## 对本网站的选择建议

- 重视长期免费额度和出站流量成本：优先评估 Cloudflare R2。
- 主要面向中国大陆访客：评估腾讯云 COS、阿里云 OSS 或七牛云，并测试实际访问速度及 HTTPS 分发成本。
- Supabase 的免费存储较小；本网站已经有 PostgreSQL 和 Payload CMS，暂不需要为了文件存储替换数据库或后台。

接入前先确认访问地区、媒体总量和每月下载量，再选择平台。
接入操作见 [R2 配置文档](R2_STORAGE.md)。实际连通性及服务器运行状态须另行验证。

## 官方资料

- [Cloudflare R2 价格及免费额度](https://developers.cloudflare.com/r2/pricing/)
- [Backblaze B2 价格](https://www.backblaze.com/cloud-storage/pricing)
- [Backblaze 请求费用](https://www.backblaze.com/cloud-storage/transaction-pricing)
- [Supabase 套餐价格](https://supabase.com/pricing)
- [七牛云免费额度及查看方法](https://developer.qiniu.com/af/12968/freequota)
- [七牛云新建空间与测试域名限制](https://developer-doc.qiniu.com/products/kodo/kodo-console-guide/bucket-management/0-the-new-space)
- [腾讯云 COS 免费额度](https://cloud.tencent.com/document/product/436/6240)
- [阿里云 OSS 新用户免费试用](https://help.aliyun.com/zh/oss/free-quota-for-new-users)
- [Google Cloud 免费额度](https://docs.cloud.google.com/free/docs/free-cloud-features#cloud-storage)
- [AWS S3 价格及新用户计划](https://aws.amazon.com/s3/pricing/)
- [AWS 免费计划常见问题](https://aws.amazon.com/free/free-tier-faqs/)
