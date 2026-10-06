import { RichText } from '@payloadcms/richtext-lexical/react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import type { Page } from '@/payload-types';
import { getEntries } from '@/lib/content';
import { Link } from '@/i18n/navigation';
import { Hero } from './hero';
import { IdealHome } from '../ideal-home';
import { Portals } from './portals';
import { EntryList } from '../entry-list';

type BlockRendererProps = {
  blocks: Page['layout'];
  pagePath?: string;
};

/** 服务端区块分发器：schema 决定数据形状，各区块负责自己的 UI。 */
export async function BlockRenderer({ blocks, pagePath }: BlockRendererProps) {
  const isHome = pagePath === '/';
  if (isHome) return <IdealHome />;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('common');
  const navT = await getTranslations('navigation');

  return (
    <div className={isHome ? 'home-page' : 'page-content'}>
      {await Promise.all(
        (blocks ?? []).map(async (block, index) => {
          const key = block.id ?? index;
          switch (block.blockType) {
            case 'hero':
              return (
                <Hero
                  key={key}
                  block={block}
                  title={pagePath === '/about' ? navT('about') : block.title}
                />
              );
            case 'portals':
              return (
                <Portals
                  key={key}
                  title={block.title}
                  description={block.description}
                  compact={isHome}
                />
              );
            case 'statement':
              return (
                <section
                  key={key}
                  className="statement grid [grid-template-columns:1fr_2.2fr_0.5fr] items-start gap-[30px] [border-block:1px_solid_var(--line)] py-[45px] [margin-block:32px] [&_>_.eyebrow]:text-[color:var(--muted)] [&_>_.eyebrow]:pt-[8px] [&_h2]:text-[28px] [&_h2]:font-[500] [&_h2]:leading-[1.6] [&_h2]:tracking-[-0.6px] [&_div_p]:text-[color:var(--muted)] [&_div_p]:text-[13px] [&_div_p]:leading-[2] [&_div_p]:max-w-[540px] [&_div_p]:mt-[14px] [&_>_span]:text-[62px] [&_>_span]:text-[color:var(--accent)] [&_>_span]:[justify-self:end] max-[760px]:[grid-template-columns:1fr] max-[760px]:gap-[18px] max-[760px]:[margin-block:20px] max-[760px]:py-[32px] max-[760px]:[&_>_span]:hidden max-[760px]:[&_h2]:text-[24px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)]"
                >
                  <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
                    {block.eyebrow}
                  </p>
                  <div>
                    <h2>{block.title}</h2>
                    <p>{block.description}</p>
                  </div>
                  <span aria-hidden="true">✳</span>
                </section>
              );
            case 'text':
              return (
                <section
                  className="prose max-w-[800px] [overflow-wrap:anywhere] text-[16px] leading-[2] [&_p]:[margin-block:1.2em] [&_ul]:[margin-block:1.2em] [&_ul]:list-disc [&_ul]:pl-[1.5em] [&_ol]:[margin-block:1.2em] [&_ol]:list-decimal [&_ol]:pl-[1.5em] [&_blockquote]:[margin-block:1.2em] [&_blockquote]:[border-left:3px_solid_var(--accent)] [&_blockquote]:pl-[24px] [&_blockquote]:text-[color:var(--muted)] [&_h2]:text-[28px] [&_h2]:[margin-block:1.8em_0.7em] [&_h3]:text-[22px] [&_h3]:[margin-block:1.5em_0.5em] [&_a]:text-[color:var(--accent)] [&_a]:underline [&_a]:[text-underline-offset:4px] [&_img]:max-w-[100%] [&_img]:h-[auto] [&_pre]:[overflow-x:auto] [&_pre]:p-[20px] [&_pre]:bg-[var(--ink)] [&_pre]:[color:white] [&_pre]:rounded-[8px] [&_code]:font-[family-name:var(--font-mono)] [&_code]:text-[0.85em] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] section py-[64px] max-[760px]:py-[40px]"
                  key={key}
                >
                  <RichText data={block.content} />
                </section>
              );
            case 'collection': {
              if (!block.limit) throw new Error('Collection block is missing its display limit');
              const result = await getEntries(block.source, block.limit, 1, locale);
              // 首页只在确实有内容时展示更新，避免空状态抢走个人介绍的注意力。
              if (isHome && !result.docs.length) return null;
              return (
                <section
                  className={`section py-[64px] max-[760px]:py-[40px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] ${isHome ? 'home-collection pt-[56px] max-[760px]:pt-[40px] pt-[56px] max-[760px]:pt-[40px]' : ''}`}
                  key={key}
                >
                  <div className="section-heading flex justify-between items-end gap-[30px] mb-[28px] [&_.eyebrow]:text-[color:var(--accent)] [&_.eyebrow]:mb-[10px] [&_h2]:text-[30px] [&_h2]:tracking-[-1px] [&_h2]:font-[550] [&_>_p]:text-[13px] [&_>_p]:text-[color:var(--muted)] [&_>_p]:leading-[1.8] [&_>_p]:max-w-[290px] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[12px] max-[760px]:[&_h2]:text-[27px]">
                    <div>
                      <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
                        {t('latest')}
                      </p>
                      <h2>{block.title}</h2>
                    </div>
                    <Link
                      className="text-link inline-flex gap-[14px] items-center text-[13px] font-[500] [&:hover]:text-[color:var(--accent)]"
                      href={`/${block.source}`}
                    >
                      {t('viewAll')} ↗
                    </Link>
                  </div>
                  <EntryList entries={result.docs} />
                </section>
              );
            }
          }
        }),
      )}
    </div>
  );
}
