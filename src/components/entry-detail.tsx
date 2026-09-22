import Image from 'next/image';
import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Entry } from '@/payload-types';
import { kindLabels } from '@/lib/content';

/** 所有内容类型复用阅读布局，保持正文语义和封面无障碍描述一致。 */
export function EntryDetail({ entry }: { entry: Entry }) {
  const cover = typeof entry.cover === 'object' ? entry.cover : null;
  return (
    <article className="article shell section">
      <Link className="text-link" href={`/${entry.kind}`}>
        ← 返回{kindLabels[entry.kind]}
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
          访问作品 ↗
        </a>
      )}
    </article>
  );
}
