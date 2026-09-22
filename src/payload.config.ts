import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { zh } from '@payloadcms/translations/languages/zh';
import { en } from '@payloadcms/translations/languages/en';
import sharp from 'sharp';
import { Entries, Media, Pages, Users } from './cms/collections';
import { SiteSettings } from './cms/site-settings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** 配置缺失时不静默切换假数据或其他数据库；运行环境由 .env 明确提供。 */
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  i18n: { fallbackLanguage: 'zh', supportedLanguages: { zh, en } },
  collections: [Users, Pages, Entries, Media],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // 开发环境允许同步 schema；生产必须显式执行版本化迁移。
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  upload: { limits: { fileSize: 10_000_000 } },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});
