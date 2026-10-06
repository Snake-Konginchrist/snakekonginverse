import { createRequire } from 'node:module';
import { existsSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const require = createRequire(`${process.cwd()}/package.json`);
// 与 systemd EnvironmentFile 保持一致，先载入主配置，再补 Next.js 环境文件。
process.loadEnvFile('.env');
createRequire(require.resolve('next'))('@next/env').loadEnvConfig(process.cwd(), false);
for (const key of ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SITE_URL', 'MEDIA_DIR']) {
  if (!process.env[key]) throw new Error(`服务器环境配置缺少 ${key}`);
}
const media = process.env.MEDIA_DIR;
if (!isAbsolute(media) || !existsSync(media) || !statSync(media).isDirectory()) {
  throw new Error('MEDIA_DIR 必须指向已存在的绝对路径目录。');
}
const mediaPath = realpathSync(media);
const appPath = realpathSync(process.argv[3]);
const childPath = relative(appPath, mediaPath);
if (!childPath || (!childPath.startsWith('../') && !isAbsolute(childPath))) {
  throw new Error('媒体必须存放在项目目录之外，先迁出再启用自动部署。');
}
if (process.argv[2] === 'media') {
  console.info(mediaPath);
} else if (process.argv[2] === 'backup') {
  const connection = new URL(process.env.DATABASE_URL);
  const password =
    connection.searchParams.get('password') ?? decodeURIComponent(connection.password);
  connection.password = '';
  connection.searchParams.delete('password');
  const result = spawnSync(
    'pg_dump',
    ['--dbname', connection.toString(), '--format=custom', '--file', process.argv[4]],
    {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'inherit',
    },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} else if (process.argv[2] === 'run') {
  const result = spawnSync('pnpm', process.argv.slice(4), {
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} else {
  throw new Error('未知部署配置操作。');
}
