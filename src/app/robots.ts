import type { MetadataRoute } from 'next';

/** 私有后台与预览不参与搜索收录；权限仍由服务端执行。 */
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/preview',
        '/zh-CN/preview',
        '/zh-TW/preview',
        '/en/preview',
        '/ja/preview',
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
