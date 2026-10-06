import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { cms, kinds } from '@/lib/content';
import siteConfig from '@/config/site.json';
import { EntryList } from './entry-list';

export async function HomeRecentEntries() {
  const locale = (await getLocale()) as Locale;
  const result = await (
    await cms()
  ).find({
    collection: 'entries',
    where: { kind: { in: [...kinds] } },
    sort: '-createdAt',
    limit: siteConfig.collectionDefaultLimit,
    locale,
    overrideAccess: false,
  });
  if (!result.docs.length) return null;
  const t = await getTranslations('narrative');
  return (
    <section className="mx-auto w-[min(1200px,calc(100%_-_96px))] py-12 max-[760px]:w-[calc(100%_-_40px)]">
      <h2 className="text-3xl font-semibold">{t('recentTitle')}</h2>
      <p className="mb-7 mt-3 text-sm leading-7 text-[var(--muted)]">{t('recentDescription')}</p>
      <EntryList entries={result.docs} />
    </section>
  );
}
