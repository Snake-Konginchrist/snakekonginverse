# GitHub Actions 自动部署

推送到 `main` 后，GitHub Actions 通过 SSH 部署该提交。也可以在 Actions 页面手动运行。
原生 Node.js、PostgreSQL、Nginx 和 systemd 部署保持不变。
首次配置尚未填入 `DEPLOY_SERVICE` 和 `DEPLOY_HEALTH_URL` 时，部署任务会跳过；服务器准备完成后再填写并手动触发首轮部署。

## 一次性配置服务器

先按 [部署文档](DEPLOYMENT.md) 完成首次部署，配置真实 `.env` 中的数据库及 R2 连接。
以下示例使用 `/var/www/snakekonginverse`、用户 `ubuntu`、服务 `snakekonginverse.service`。
实际值必须与服务器一致，SSH 登录用户应为运行服务的用户。

服务器必须能够从非交互 SSH 会话找到 Node.js（`^22.23.4 || >=24.22.1`）、pnpm 12.9.1、`pg_dump`、`flock`、`tar` 和 `curl`。
Node.js/pnpm 若仅在交互式终端通过 nvm 配置，须先使部署账户的非交互 PATH 可用。
可在 `.deploy/runtime.env` 中保存 `PATH=/实际/node/bin:/usr/local/bin:/usr/bin:/bin`；部署脚本和 systemd 会使用该路径。

准备发布目录并安装 systemd override：

```bash
sudo install -d -o ubuntu -g ubuntu /var/www/snakekonginverse/.deploy
sudo install -d /etc/systemd/system/snakekonginverse.service.d
sudo cp deploy/automatic-deploy.conf /etc/systemd/system/snakekonginverse.service.d/automatic-deploy.conf
sudo systemctl daemon-reload
```

首次切换前保持当前服务运行；首轮自动部署完成后会创建 `.deploy/current` 并重启服务。
override 改变工作目录、运行路径与缓存写入路径；原有环境配置与运行用户继续使用。
`.env` 应位于网站根目录；媒体存入 R2，不再需要 `MEDIA_DIR` 或本地媒体目录。

通过 `sudo visudo -f /etc/sudoers.d/snakekonginverse-deploy` 只授权以下服务操作：

```text
ubuntu ALL=(root) NOPASSWD: /usr/bin/systemctl stop snakekonginverse.service, /usr/bin/systemctl start snakekonginverse.service
```

为 GitHub Actions 建立专用 SSH 密钥，将公钥加入部署用户的 `authorized_keys`。
该账户须能写网站目录与 `.deploy`，并能读取环境配置、备份站点数据库，并读写本站 R2 存储桶。
私钥只配置到 GitHub Secrets，不提交到仓库。

## 配置 GitHub

在仓库 Settings → Secrets and variables → Actions 配置以下 Variables：

| 名称                | 含义 / 示例                                  |
| ------------------- | -------------------------------------------- |
| `DEPLOY_HOST`       | 实际服务器 IP 或域名                         |
| `DEPLOY_PORT`       | SSH 实际端口，例如 `22`                      |
| `DEPLOY_USER`       | SSH 登录用户，与 systemd 的 User 相同        |
| `DEPLOY_PATH`       | `/var/www/snakekonginverse`                  |
| `DEPLOY_SERVICE`    | `snakekonginverse.service`                   |
| `DEPLOY_HEALTH_URL` | `http://127.0.0.1:3000/`，按实际监听端口修改 |

再配置两个 Secrets：

| 名称                 | 内容                                                |
| -------------------- | --------------------------------------------------- |
| `DEPLOY_SSH_KEY`     | 专用部署 SSH 私钥                                   |
| `DEPLOY_KNOWN_HOSTS` | 已核对指纹的服务器 SSH 公钥记录（known_hosts 格式） |

可用 `ssh-keyscan -p 端口 服务器地址` 获取公钥记录，但须与服务器控制台或现有可信 SSH 记录核对指纹。
工作流强制校验服务器公钥。GitHub Actions 使用仓库 checkout；服务器不需要额外保存仓库访问令牌。
数据库密码、Payload 密钥、R2 访问密钥等配置只保留在服务器环境文件中。

## 每次部署过程

1. 上传该提交的代码归档；GitHub 与服务器分别限制并发部署。
2. 将服务器现有 `.env`、`.env.*` 复制到私有备份及新发布目录；不覆盖原文件。
3. 在新目录安装锁定依赖，预检 R2 连接，生成 Next.js 类型并执行 `pnpm check` 和 `pnpm build`，此时原服务继续运行。
4. 停止服务，备份数据库、R2 对象，执行生产迁移和幂等初始化。
5. 原子切换 `.deploy/current`，启动服务并检查本机页面返回 HTTP 200。

检查/构建失败不会切换正在运行的版本。迁移前的备份失败会尝试重新启动原服务。
开始迁移后失败会保留发布目录和备份，停止自动操作并使工作流失败；不会自动降级数据库。
首次运行若备份失败、尚无 `.deploy/current`，须撤下 override 后恢复原服务。
GitHub Actions 日志会标出部署结果和服务器备份目录。

## 备份与故障恢复

备份位于 `.deploy/backups/时间戳-提交/`，含环境文件、`database.dump` 和 `r2/`（文件及 `manifest.json` 对象映射）；
发布代码位于 `.deploy/releases/`。目录默认仅部署用户可访问。每次成功部署后自动保留最近 5 个发布版本和最近 7 份备份，
更早的发布目录和备份会清理；清理只匹配部署脚本生成的目录名，不会删除其他文件。
不要手动删除 `current` 指向的目录或仍需恢复的备份。

失败后先检查 Actions 日志、`journalctl -u snakekonginverse.service` 和备份。
数据库迁移可能已改变数据结构，不能只切回旧代码：根据迁移兼容性决定继续修复或停服务后恢复匹配的数据库、R2 对象与代码。备份仅保存在本服务器，还需安排异地备份及恢复验证。
文件语法检查和本机测试不等于真实服务器部署成功；首次上线须实际运行工作流并核对页面、后台和媒体。
