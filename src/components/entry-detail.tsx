import Image from 'next/image';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { useTranslations } from 'next-intl';
import type { Entry } from '@/payload-types';
import { Link } from '@/i18n/navigation';

/** 所有内容类型复用阅读布局，保持正文语义和封面无障碍描述一致。 */
export function EntryDetail({ entry }: { entry: Entry }) {
  const t = useTranslations('common');
  const kindT = useTranslations('contentKinds');
  const cover = typeof entry.cover === 'object' ? entry.cover : null;
  return (
    <article className="article shell section">
      <Link className="text-link" href={`/${entry.kind}`}>
        ← {t('backTo', { section: kindT(entry.kind) })}
      </Link>
      <header className="article-header">
        <p className="eyebrow">{entry.tags?.map((tag) => tag.label).join(' / ')}</p>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
      </header>
      {cover?.url && (
        <Image
          className="article-cover"
          src={cover.url}
          alt={cover.alt}
          width={cover.width ?? 1200}
          height={cover.height ?? 800}
        />
      )}
      <div className="prose">
        <RichText data={entry.content} />
      </div>
      {entry.externalURL && (
        <a
          className="button button-primary"
          href={entry.externalURL}
          target="_blank"
          rel="noreferrer"
        >
          {t('visitWork')} ↗
        </a>
      )}
    </article>
  );
}
