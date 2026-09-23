import { RichText } from '@payloadcms/richtext-lexical/react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import type { Page } from '@/payload-types';
import { getEntries } from '@/lib/content';
import { Link } from '@/i18n/navigation';
import { Hero } from './hero';
import { Portals } from './portals';
import { EntryList } from '../entry-list';

type BlockRendererProps = {
  blocks: Page['layout'];
  pagePath?: string;
};

function localizeStarterBlock(
  block: Page['layout'][number],
  pagePath: string | undefined,
  t: (key: string) => string,
) {
  if (pagePath === '/' && block.blockType === 'hero') {
    return {
      ...block,
      eyebrow: t('home.heroEyebrow'),
      title: t('home.heroTitle'),
      description: t('home.heroDescription'),
      linkLabel: t('home.heroLink'),
    };
  }
  if (pagePath === '/' && block.blockType === 'collection') {
    return { ...block, title: t('home.collectionTitle') };
  }
  if (pagePath === '/' && block.blockType === 'portals') {
    return { ...block, title: t('home.portalsTitle'), description: t('home.portalsDescription') };
  }
  if (pagePath === '/about' && block.blockType === 'hero') {
    return {
      ...block,
      eyebrow: t('about.heroEyebrow'),
      title: t('about.heroTitle'),
      description: t('about.heroDescription'),
      linkLabel: t('about.heroLink'),
    };
  }
  if (pagePath === '/about' && block.blockType === 'statement') {
    return {
      ...block,
      eyebrow: t('about.statementEyebrow'),
      title: t('about.statementTitle'),
      description: t('about.statementDescription'),
    };
  }
  return block;
}

/** 服务端区块分发器：schema 决定数据形状，各区块负责自己的 UI。 */
export async function BlockRenderer({ blocks, pagePath }: BlockRendererProps) {
  const isHome = pagePath === '/';
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('common');
  const cmsT = await getTranslations('cms');

  return (
    <div className={isHome ? 'home-page' : 'page-content'}>
      {await Promise.all(
        (blocks ?? []).map(async (rawBlock, index) => {
          const block = localizeStarterBlock(rawBlock, pagePath, cmsT);
          const key = block.id ?? index;
          switch (block.blockType) {
            case 'hero':
              return <Hero key={key} block={block} compact={isHome} />;
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
              if (isHome) return null;
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
              const result = await getEntries(block.source, block.limit ?? 3, 1, locale);
              // 首页只在确实有内容时展示更新，避免空状态抢走个人介绍的注意力。
              if (isHome && !result.docs.length) return null;
              return (
                <section className={`section shell ${isHome ? 'home-collection' : ''}`} key={key}>
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">{t('latest')}</p>
                      <h2>{block.title}</h2>
                    </div>
                    <Link className="text-link" href={`/${block.source}`}>
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
