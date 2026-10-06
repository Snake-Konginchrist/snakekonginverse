import type { MetadataRoute } from 'next';
import { requiredEnv } from '@/lib/env';

/** 私有后台与预览不参与搜索收录；权限仍由服务端执行。 */
export default function robots(): MetadataRoute.Robots {
  const origin = requiredEnv('NEXT_PUBLIC_SITE_URL');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/preview',
        '/preview/zh-CN',
        '/preview/zh-TW',
        '/preview/en',
        '/preview/ja',
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
