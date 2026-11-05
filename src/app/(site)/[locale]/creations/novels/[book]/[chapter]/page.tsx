import { WordCount } from '@/components/novels/word-count';
import { ViewCount } from '@/components/novels/view-count';
import { viewCounts } from '@/lib/novel-views';
import { PublicationDate } from '@/components/novels/publication-date';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNovel, getChapters } from '@/lib/novels';
import { cms } from '@/lib/content';
import { NovelMarkdown } from '@/components/novels/markdown';

type Props = { params: Promise<{ book: string; chapter: string }> };
async function load(params: Props['params']) {
  const path = await params;
  const book = await getNovel(path.book);
  if (!book) notFound();
  const result = await (
    await cms()
  ).find({
    collection: 'chapters',
    where: { and: [{ novel: { equals: book.id } }, { slug: { equals: path.chapter } }] },
    overrideAccess: false,
    limit: 1,
  });
  const chapter = result.docs[0];
  if (!chapter) notFound();
  return { book, chapter };
}
export async function generateMetadata({ params }: Props) {
  const { book, chapter } = await load(params);
  return {
    title: `${chapter.title} - ${book.title}`,
    alternates: { canonical: `/creations/novels/${book.slug}/${chapter.slug}` },
  };
}
export default async function ChapterPage({ params }: Props) {
  const { book, chapter } = await load(params);
  const { docs } = await getChapters(book.id);
  const index = docs.findIndex((item) => item.id === chapter.id);
  const t = await getTranslations('novels');
  const counts = await viewCounts(await cms(), [`chapter:${chapter.id}`]);
  const base = `/creations/novels/${book.slug}`;
  return (
    <article className="novel-reader" lang={book.language}>
      <nav className="novel-reader-nav">
        <Link href={base}>← {book.title}</Link>
        <Link href={base}>{t('contents')}</Link>
      </nav>
      <header>
        <p className="novel-kicker">
          {String(index + 1).padStart(2, '0')} / {docs.length}
        </p>
        <h1>{chapter.title}</h1>
        <PublicationDate value={chapter.publishedAt} />
        <WordCount markdown={chapter.markdown} />
        <ViewCount
          key={chapter.id}
          initial={counts[`chapter:${chapter.id}`] ?? 0}
          book={book.slug}
          chapter={chapter.slug}
        />
        <div className="novel-divider">✳</div>
      </header>
      <NovelMarkdown text={chapter.markdown} />
      <p className="novel-rights">{t('rights')}</p>
      <nav className="novel-reader-nav novel-bottom" aria-label={t('navigation')}>
        {docs[index - 1] ? (
          <Link href={`${base}/${docs[index - 1].slug}`}>← {t('previous')}</Link>
        ) : (
          <span />
        )}
        <Link href={base}>{t('contents')}</Link>
        {docs[index + 1] ? (
          <Link href={`${base}/${docs[index + 1].slug}`}>{t('next')} →</Link>
        ) : (
          <span>{t('end')}</span>
        )}
      </nav>
    </article>
  );
}
