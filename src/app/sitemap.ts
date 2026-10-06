import type { MetadataRoute } from 'next';
import { cms, kinds } from '@/lib/content';
import { locales, localizedPath } from '@/i18n/routing';
import { requiredEnv } from '@/lib/env';
import siteConfig from '@/config/site.json';

export const dynamic = 'force-dynamic';
/** 分页遍历而非固定截取，站点增长后仍覆盖全部已发布内容。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = requiredEnv('NEXT_PUBLIC_SITE_URL');
  const directoryRoutes = [
    'links',
    'recommendations',
    'communities',
    'contact',
    'identities',
    'changelog',
    'discussion',
  ];
  const publicRoutes = [...kinds, ...directoryRoutes];
  const result: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${origin}${localizedPath('/', locale)}` },
    ...publicRoutes.map((route) => ({ url: `${origin}${localizedPath(`/${route}`, locale)}` })),
  ]);
  const payload = await cms();
  for (const collection of ['pages', 'entries'] as const) {
    let page = 1;
    let more = true;
    while (more) {
      const batch = await payload.find({
        collection,
        page,
        limit: siteConfig.sitemapPageSize,
        depth: 0,
        overrideAccess: false,
      });
      for (const doc of batch.docs) {
        const pathname = 'path' in doc ? doc.path : `/${doc.kind}/${doc.slug}`;
        for (const locale of locales) {
          result.push({ url: `${origin}${localizedPath(pathname, locale)}`, lastModified: doc.updatedAt });
        }
      }
      more = batch.hasNextPage;
      page++;
    }
  }
  return result;
}
