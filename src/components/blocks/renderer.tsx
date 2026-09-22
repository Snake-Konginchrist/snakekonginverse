import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Page } from '@/payload-types';
import { getEntries } from '@/lib/content';
import { Hero } from './hero';
import { Portals } from './portals';
import { EntryList } from '../entry-list';

/** 服务端区块分发器：schema 决定数据形状，各区块负责自己的 UI。 */
export async function BlockRenderer({ blocks }: { blocks: Page['layout'] }) {
  return (
    <>
      {await Promise.all(
        (blocks ?? []).map(async (block, index) => {
          const key = block.id ?? index;
          switch (block.blockType) {
            case 'hero':
              return <Hero key={key} block={block} />;
            case 'portals':
              return <Portals key={key} title={block.title} description={block.description} />;
            case 'statement':
              return (
                <section key={key} className="statement shell">
                  <p className="eyebrow">{block.eyebrow}</p>
                  <div>
                    <h2>{block.title}</h2>
                    <p>{block.description}</p>
                  </div>
                  <span aria-hidden="true">✳</span>
                </section>
              );
            case 'text':
              return (
                <section className="prose shell section" key={key}>
                  <RichText data={block.content} />
                </section>
              );
            case 'collection': {
              const result = await getEntries(block.source, block.limit ?? 3);
              return (
                <section className="section shell" key={key}>
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">LATEST FROM THE VERSE</p>
                      <h2>{block.title}</h2>
                    </div>
                    <Link className="text-link" href={`/${block.source}`}>
                      查看全部 ↗
                    </Link>
                  </div>
                  <EntryList entries={result.docs} />
                </section>
              );
            }
          }
        }),
      )}
    </>
  );
}
