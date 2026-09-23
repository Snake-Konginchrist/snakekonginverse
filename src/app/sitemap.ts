import type { MetadataRoute } from 'next';
import { cms, kinds } from '@/lib/content';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-dynamic';
/** 分页遍历而非固定截取，站点增长后仍覆盖全部已发布内容。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
    { url: `${origin}/${locale}` },
    ...publicRoutes.map((route) => ({ url: `${origin}/${locale}/${route}` })),
  ]);
  const payload = await cms();
  for (const collection of ['pages', 'entries'] as const) {
    let page = 1;
    let more = true;
    while (more) {
      const batch = await payload.find({
        collection,
        page,
        limit: 100,
        depth: 0,
        overrideAccess: false,
      });
      for (const doc of batch.docs) {
        const pathname = 'path' in doc ? doc.path : `/${doc.kind}/${doc.slug}`;
        for (const locale of locales) {
          result.push({ url: `${origin}/${locale}${pathname}`, lastModified: doc.updatedAt });
        }
      }
      more = batch.hasNextPage;
      page++;
    }
  }
  return result;
}
