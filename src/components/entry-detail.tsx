import Image from 'next/image';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { useTranslations } from 'next-intl';
import type { Entry } from '@/payload-types';
import { SectionHero } from './section-hero';
import { Link } from '@/i18n/navigation';

/** 所有内容类型复用阅读布局，保持正文语义和封面无障碍描述一致。 */
export function EntryDetail({ entry }: { entry: Entry }) {
  const t = useTranslations('common');
  const kindT = useTranslations('contentKinds');
  const cover = typeof entry.cover === 'object' ? entry.cover : null;
  return (
    <>
      <SectionHero
        section={entry.kind}
        title={entry.title}
        description={entry.summary}
        eyebrow={kindT(entry.kind)}
        detail
      />
      <article className="article [&_h1]:text-[clamp(32px,_5vw,_54px)] [&_h1]:font-[550] [&_h1]:tracking-[-1.5px] [&_h1]:mt-[20px] max-w-[850px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] section py-[64px] max-[760px]:py-[40px]">
        <Link
          className="text-link inline-flex gap-[14px] items-center text-[13px] font-[500] [&:hover]:text-[color:var(--accent)]"
          href={`/${entry.kind}`}
        >
          ← {t('backTo', { section: kindT(entry.kind) })}
        </Link>
        {entry.tags?.length ? (
          <p className="my-6 text-xs tracking-wider text-[var(--muted)]">
            {entry.tags.map((tag) => tag.label).join(' / ')}
          </p>
        ) : null}
        {cover?.url && (
          <Image
            className="article-cover w-[100%] h-[auto] rounded-[12px] mb-[35px]"
            src={cover.url}
            alt={cover.alt}
            width={cover.width ?? 1200}
            height={cover.height ?? 800}
          />
        )}
        <div className="prose max-w-[800px] [overflow-wrap:anywhere] text-[16px] leading-[2] [&_p]:[margin-block:1.2em] [&_ul]:[margin-block:1.2em] [&_ul]:list-disc [&_ul]:pl-[1.5em] [&_ol]:[margin-block:1.2em] [&_ol]:list-decimal [&_ol]:pl-[1.5em] [&_blockquote]:[margin-block:1.2em] [&_blockquote]:[border-left:3px_solid_var(--accent)] [&_blockquote]:pl-[24px] [&_blockquote]:text-[color:var(--muted)] [&_h2]:text-[28px] [&_h2]:[margin-block:1.8em_0.7em] [&_h3]:text-[22px] [&_h3]:[margin-block:1.5em_0.5em] [&_a]:text-[color:var(--accent)] [&_a]:underline [&_a]:[text-underline-offset:4px] [&_img]:max-w-[100%] [&_img]:h-[auto] [&_pre]:[overflow-x:auto] [&_pre]:p-[20px] [&_pre]:bg-[var(--ink)] [&_pre]:[color:white] [&_pre]:rounded-[8px] [&_code]:font-[family-name:var(--font-mono)] [&_code]:text-[0.85em]">
          <RichText data={entry.content} />
        </div>
        {entry.externalURL && (
          <a
            className="button inline-flex items-center justify-center gap-[24px] min-h-[48px] p-[14px_23px] border border-transparent rounded-[7px] text-[14px] font-[600] [transition:background_0.2s,_transform_0.2s] button-primary bg-[var(--accent)] text-[color:#fff] [&:hover]:[filter:brightness(0.92)] [&:hover]:[transform:translateY(-2px)]"
            href={entry.externalURL}
            target="_blank"
            rel="noreferrer"
          >
            {t('visitWork')} ↗
          </a>
        )}
      </article>
    </>
  );
}
