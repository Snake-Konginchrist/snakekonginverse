import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Feather } from 'lucide-react';
import type { Entry } from '@/payload-types';

/** 空内容是正常状态；不使用示例作品、假时间或虚构阅读量填充布局。 */
export function EntryList({ entries }: { entries: Entry[] }) {
  if (!entries.length)
    return (
      <div className="empty-state">
        <Feather size={30} strokeWidth={1.2} />
        <div>
          <h3>故事，正在酝酿。</h3>
          <p>这里还没有已发布的内容。下一次相遇，也许会有新的发现。</p>
        </div>
        <span className="empty-mark">TO BE CONTINUED ↗</span>
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
