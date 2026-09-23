import Image from 'next/image';
import { ArrowUpRight, Feather } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Entry } from '@/payload-types';
import { Link } from '@/i18n/navigation';

/** 空内容是正常状态；不使用示例作品、假时间或虚构阅读量填充布局。 */
export function EntryList({ entries }: { entries: Entry[] }) {
  const t = useTranslations('archive');
  if (!entries.length)
    return (
      <div className="empty-state">
        <Feather size={30} strokeWidth={1.2} />
        <div>
          <h3>{t('emptyTitle')}</h3>
          <p>{t('emptyDescription')}</p>
        </div>
        <span className="empty-mark">{t('emptyMark')}</span>
      </div>
    );
  return (
    <div className="entry-grid">
      {entries.map((entry) => {
        const cover = typeof entry.cover === 'object' ? entry.cover : null;
        return (
          <Link className="entry-card" href={`/${entry.kind}/${entry.slug}`} key={entry.id}>
            {cover?.url && (
              <div className="entry-cover">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="entry-card-body">
              <p className="eyebrow">
                {entry.tags?.map((tag) => tag.label).join(' / ') || 'FROM THE VERSE'}
              </p>
              <h3>
                {entry.title}
                <ArrowUpRight size={18} />
              </h3>
              <p>{entry.summary}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
