import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getEntries, getEntry, getPage, isContentKind } from '@/lib/content';
import { BlockRenderer } from '@/components/blocks/renderer';
import { EntryDetail } from '@/components/entry-detail';
import { EntryList } from '@/components/entry-list';
import { Link } from '@/i18n/navigation';
import { hasLocale, type Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; path?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

/** 内容详情使用固定栏目路径，自定义页面使用完整路径，避免二者争抢路由。 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, path } = await params;
  if (!hasLocale(localeParam)) return { title: '页面未找到', robots: { index: false } };
  const segments = path ?? [];
  const pathname = `/${segments.join('/')}`;
  const kindT = await getTranslations({ locale: localeParam, namespace: 'contentKinds' });
  if (segments.length === 1 && isContentKind(segments[0])) {
    const archiveT = await getTranslations({ locale: localeParam, namespace: 'archive' });
    return {
      title: kindT(segments[0]),
      description: archiveT('intro'),
      alternates: { canonical: `/${localeParam}${pathname}` },
    };
  }
  const doc =
    segments.length === 2 && isContentKind(segments[0])
      ? await getEntry(segments[0], segments[1], localeParam)
      : await getPage(pathname, localeParam);
  if (!doc) return { title: '页面未找到', robots: { index: false } };
  return {
    title: doc.seo?.title || doc.title,
    description:
      doc.seo?.description ||
      ('summary' in doc
        ? doc.summary
        : doc.layout.find((block) => block.blockType === 'hero')?.description),
    alternates: { canonical: `/${localeParam}${pathname}` },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: localeParam, path } = await params;
  if (!hasLocale(localeParam)) notFound();
  const segments = path ?? [];
  const locale: Locale = localeParam;
  const kindT = await getTranslations('contentKinds');
  const archiveT = await getTranslations('archive');
  const commonT = await getTranslations('common');
  if (segments.length === 1 && isContentKind(segments[0])) {
    const kind = segments[0];
    const rawPage = (await searchParams).page ?? '1';
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1) notFound();
    const result = await getEntries(kind, 9, page, locale);
    if (page > 1 && page > result.totalPages) notFound();
    return (
      <section className="shell section archive">
        <p className="eyebrow">{archiveT('explore', { kind: kind.toUpperCase() })}</p>
        <h1>{kindT(kind)}</h1>
        <p className="archive-intro">{archiveT('intro')}</p>
        <EntryList entries={result.docs} />
        <nav className="pagination" aria-label="内容分页">
          {result.hasPrevPage && (
            <Link href={`/${kind}?page=${page - 1}`}>← {commonT('previous')}</Link>
          )}
          {result.hasNextPage && (
            <Link href={`/${kind}?page=${page + 1}`}>{commonT('next')} →</Link>
          )}
        </nav>
      </section>
    );
  }
  if (segments.length === 2 && isContentKind(segments[0])) {
    const entry = await getEntry(segments[0], segments[1], locale);
    if (!entry) notFound();
    return <EntryDetail entry={entry} />;
  }
  const pathname = `/${segments.join('/')}`;
  const page = await getPage(pathname, locale);
  if (!page) notFound();
  return <BlockRenderer blocks={page.layout} pagePath={pathname} />;
}
