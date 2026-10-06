import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { zh } from '@payloadcms/translations/languages/zh';
import { en } from '@payloadcms/translations/languages/en';
import sharp from 'sharp';
import { s3Storage } from '@payloadcms/storage-s3';
import { getR2Settings, requireR2Settings } from './lib/r2-config.mjs';
import { Entries, Media, Pages, Users } from './cms/collections';
import { SiteSettings } from './cms/site-settings';
import { requiredEnv } from './lib/env';
import siteConfig from './config/site.json';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** 配置缺失时不静默切换假数据或其他数据库；运行环境由 .env 明确提供。 */
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  i18n: { supportedLanguages: { zh, en } },
  localization: {
    defaultLocale: siteConfig.defaultLocale as 'zh-CN' | 'zh-TW' | 'en' | 'ja',
    locales: [
      { code: 'zh-CN', label: '简体中文' },
      { code: 'zh-TW', label: '繁體中文' },
      { code: 'en', label: 'English' },
      { code: 'ja', label: '日本語' },
    ],
  },
  collections: [Users, Pages, Entries, Media],
  plugins: [s3Storage({ collections: { media: true }, ...getR2Settings() })],
  // 类型及迁移生成无需访问 R2；应用初始化必须有真实的 R2 配置。
  onInit: async () => {
    requireR2Settings();
  },
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: requiredEnv('PAYLOAD_SECRET'),
  db: postgresAdapter({
    pool: { connectionString: requiredEnv('DATABASE_URL') },
    // Schema push must be explicit; an old dev database can otherwise block startup
    // with a destructive-change prompt. Use PAYLOAD_DB_PUSH=true only for a disposable DB.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  upload: { limits: { fileSize: siteConfig.uploadMaxFileSize } },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});
