import Image from 'next/image';
import { ArrowUpRight, Feather } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Entry } from '@/payload-types';
import { Link } from '@/i18n/navigation';

/** 空内容是正常状态；不使用示例作品、假时间或虚构阅读量填充布局。 */
export function EntryList({ entries }: { entries: Entry[] }) {
  const t = useTranslations('archive');
  const kindT = useTranslations('contentKinds');
  const narrativeT = useTranslations('narrative');
  if (!entries.length)
    return (
      <div className="empty-state flex items-center gap-[23px] p-[36px] bg-[var(--surface)] [border:1px_dashed_#ced6e7] rounded-[10px] [&_>_svg]:[flex-shrink:0] [&_>_svg]:text-[color:var(--accent)] [&_h3]:text-[18px] [&_h3]:font-[500] [&_h3]:mb-[10px] [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-[color:var(--muted)] max-[760px]:p-[24px] max-[760px]:gap-[16px] max-[760px]:items-start">
        <Feather size={30} strokeWidth={1.2} />
        <div>
          <h3>{t('emptyTitle')}</h3>
          <p>{narrativeT('emptyDescription')}</p>
        </div>
        <span className="empty-mark [margin-left:auto] whitespace-nowrap [font:9px_var(--font-mono)] tracking-[1px] text-[color:var(--muted)] max-[760px]:hidden">
          {t('emptyMark')}
        </span>
      </div>
    );
  return (
    <div className="entry-grid grid [grid-template-columns:repeat(3,_1fr)] gap-[22px] max-[760px]:[grid-template-columns:1fr]">
      {entries.map((entry) => {
        const cover = typeof entry.cover === 'object' ? entry.cover : null;
        return (
          <Link
            className="entry-card [border:1px_solid_var(--line)] bg-[var(--surface)] rounded-[10px] overflow-hidden [&:hover]:border-[var(--accent)] [&_h3]:flex [&_h3]:justify-between [&_h3]:gap-[12px] [&_h3]:text-[20px] [&_h3]:[margin-block:13px] [&_p]:text-[color:var(--muted)] [&_p]:leading-[1.8] [&_p]:text-[13px] [&_.eyebrow]:text-[9px]"
            href={`/${entry.kind}/${entry.slug}`}
            key={entry.id}
          >
            {cover?.url && (
              <div className="entry-cover relative [aspect-ratio:3/2] bg-[var(--accent-soft)] [&_img]:object-cover">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="entry-card-body p-[24px]">
              {entry.tags?.length ? (
                <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
                  {entry.tags.map((tag) => tag.label).join(' / ')}
                </p>
              ) : (
                <p className="text-xs tracking-wider text-[var(--accent)]">{kindT(entry.kind)}</p>
              )}
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
