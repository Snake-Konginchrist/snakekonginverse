import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEntries, getEntry, getPage, isContentKind, kindLabels } from '@/lib/content';
import { BlockRenderer } from '@/components/blocks/renderer';
import { EntryDetail } from '@/components/entry-detail';
import { EntryList } from '@/components/entry-list';

type Props = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

/** 内容详情使用固定栏目路径，自定义页面使用完整路径，避免二者争抢路由。 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).path ?? [];
  const pathname = `/${segments.join('/')}`;
  if (segments.length === 1 && isContentKind(segments[0]))
    return { title: kindLabels[segments[0]], alternates: { canonical: pathname } };
  const doc =
    segments.length === 2 && isContentKind(segments[0])
      ? await getEntry(segments[0], segments[1])
      : await getPage(pathname);
  if (!doc) return { title: '页面未找到', robots: { index: false } };
  return {
    title: doc.seo?.title || doc.title,
    description: doc.seo?.description || undefined,
    alternates: { canonical: pathname },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const segments = (await params).path ?? [];
  if (segments.length === 1 && isContentKind(segments[0])) {
    const kind = segments[0];
    const rawPage = (await searchParams).page ?? '1';
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1) notFound();
    const result = await getEntries(kind, 9, page);
    if (page > 1 && page > result.totalPages) notFound();
    return (
      <section className="shell section archive">
        <p className="eyebrow">EXPLORE THE VERSE / {kind.toUpperCase()}</p>
        <h1>{kindLabels[kind]}</h1>
        <p className="archive-intro">一些认真做的事，一些值得留下的想法。</p>
        <EntryList entries={result.docs} />
        <nav className="pagination" aria-label="内容分页">
          {result.hasPrevPage && <Link href={`/${kind}?page=${page - 1}`}>← 上一页</Link>}
          {result.hasNextPage && <Link href={`/${kind}?page=${page + 1}`}>下一页 →</Link>}
        </nav>
      </section>
    );
  }
  if (segments.length === 2 && isContentKind(segments[0])) {
    const entry = await getEntry(segments[0], segments[1]);
    if (!entry) notFound();
    return <EntryDetail entry={entry} />;
  }
  const page = await getPage(`/${segments.join('/')}`);
  if (!page) notFound();
  return <BlockRenderer blocks={page.layout} />;
}
