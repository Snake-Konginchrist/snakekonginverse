import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNovels } from '@/lib/novels';

export async function Bookshelf() {
  const { docs } = await getNovels();
  const t = await getTranslations('novels');
  if (!docs.length) return null;
  return (
    <section className="novel-shelf" aria-labelledby="novel-shelf-title">
      <p className="novel-kicker">{t('eyebrow')}</p>
      <h2 id="novel-shelf-title">{t('library')}</h2>
      <div className="novel-books">
        {docs.map((book) => {
          const cover = typeof book.cover === 'object' ? book.cover : null;
          return (
            <Link key={book.id} href={`/creations/novels/${book.slug}`} className="novel-book">
              <div className="novel-cover">
                {cover?.url ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt || book.title}
                    fill
                    sizes="(max-width: 760px) 45vw, 240px"
                  />
                ) : (
                  <div className="novel-typographic-cover">
                    <span>{t('eyebrow')}</span>
                    <strong>{book.title}</strong>
                    <span>✳</span>
                  </div>
                )}
              </div>
              <p className="novel-kicker">{t(book.completed ? 'completed' : 'ongoing')}</p>
              <h3>{book.title}</h3>
              <p className="novel-description">{book.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
