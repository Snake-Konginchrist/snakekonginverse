import { WordCount } from '@/components/novels/word-count';
import { cms } from '@/lib/content';
import { ViewCount } from '@/components/novels/view-count';
import { viewCounts } from '@/lib/novel-views';
import { PublicationDate } from '@/components/novels/publication-date';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNovel, getChapters } from '@/lib/novels';

type Props = { params: Promise<{ book: string; locale: string }> };
export async function generateMetadata({ params }: Props) {
  const book = await getNovel((await params).book);
  if (!book) notFound();
  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/creations/novels/${book.slug}` },
  };
}
export default async function NovelPage({ params }: Props) {
  const book = await getNovel((await params).book);
  if (!book) notFound();
  const { docs: chapters } = await getChapters(book.id);
  const counts = await viewCounts(await cms(), [
    `novel:${book.id}`,
    ...chapters.map((chapter) => `chapter:${chapter.id}`),
  ]);
  const t = await getTranslations('novels');
  const cover = typeof book.cover === 'object' ? book.cover : null;
  return (
    <div className="novel-shell">
      <Link href="/creations">← {t('library')}</Link>
      <header className="novel-heading">
        <div className="novel-cover">
          {cover?.url ? (
            <Image src={cover.url} alt={cover.alt || book.title} fill sizes="260px" />
          ) : (
            <div className="novel-typographic-cover">
              <span>{t('eyebrow')}</span>
              <strong>{book.title}</strong>
              <span>✳</span>
            </div>
          )}
        </div>
        <div>
          <p className="novel-kicker" data-status={book.completed ? 'completed' : 'ongoing'}>
            {t(book.completed ? 'completed' : 'ongoing')}
          </p>
          <h1>{book.title}</h1>
          <PublicationDate value={book.publishedAt} />
          <ViewCount key={book.id} initial={counts[`novel:${book.id}`] ?? 0} book={book.slug} />
          <p className="novel-summary">{book.description}</p>
          {chapters[0] && (
            <Link
              className="novel-start"
              href={`/creations/novels/${book.slug}/${chapters[0].slug}`}
            >
              {t('start')} →
            </Link>
          )}
        </div>
      </header>
      <section>
        <h2>
          {t('contents')} <small>{chapters.length}</small>
        </h2>
        {!chapters.length && <p>{t('empty')}</p>}
        <ol className="novel-contents">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link href={`/creations/novels/${book.slug}/${chapter.slug}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="novel-chapter-info">
                  <span className="novel-chapter-title">{chapter.title}</span>
                  <span className="novel-chapter-meta">
                    <PublicationDate value={chapter.publishedAt} />
                    <WordCount markdown={chapter.markdown} />
                    <ViewCount initial={counts[`chapter:${chapter.id}`] ?? 0} />
                  </span>
                </span>
                <span>↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
