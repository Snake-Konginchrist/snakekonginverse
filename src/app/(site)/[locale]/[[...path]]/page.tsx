import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getEntries, getEntry, getPage, isContentKind } from '@/lib/content';
import { BlockRenderer } from '@/components/blocks/renderer';
import { EntryDetail } from '@/components/entry-detail';
import { EntryList } from '@/components/entry-list';
import { Link } from '@/i18n/navigation';
import { hasLocale, localizedPath, type Locale } from '@/i18n/routing';
import { SelectedProducts } from '@/components/selected-products';
import { ResearchDirection } from '@/components/research-direction';
import { SocialMatrix } from '@/components/social-matrix';
import { SectionHero } from '@/components/section-hero';
import siteConfig from '@/config/site.json';
import { IdealHome } from '@/components/ideal-home';

type Props = {
  params: Promise<{ locale: string; path?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

/** 内容详情使用固定栏目路径，自定义页面使用完整路径，避免二者争抢路由。 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, path } = await params;
  if (!hasLocale(localeParam)) notFound();
  const segments = path ?? [];
  const pathname = `/${segments.join('/')}`;
  const titleT = await getTranslations({ locale: localeParam, namespace: 'pageTitles' });
  const cmsT = await getTranslations({ locale: localeParam, namespace: 'cms' });
  if (segments.length === 1 && isContentKind(segments[0])) {
    const sectionT = await getTranslations({ locale: localeParam, namespace: 'sections' });
    return {
      title: titleT(segments[0]),
      description: sectionT(`${segments[0]}.description`),
      alternates: { canonical: localizedPath(pathname, localeParam) },
    };
  }
  if (pathname === '/') {
    return {
      title: titleT('home'),
      description: cmsT('home.heroDescription'),
      alternates: { canonical: localizedPath('/', localeParam) },
    };
  }
  if (pathname === '/about') {
    return {
      title: titleT('about'),
      description: cmsT('about.heroDescription'),
      alternates: { canonical: localizedPath('/about', localeParam) },
    };
  }
  const doc =
    segments.length === 2 && isContentKind(segments[0])
      ? await getEntry(segments[0], segments[1], localeParam)
      : await getPage(pathname, localeParam);
  if (!doc) {
    const t = await getTranslations({ locale: localeParam, namespace: 'common' });
    return { title: t('notFoundTitle'), robots: { index: false } };
  }
  return {
    title:
      pathname === '/'
        ? titleT('home')
        : pathname === '/about'
          ? titleT('about')
          : doc.seo?.title || doc.title,
    description:
      doc.seo?.description ||
      ('summary' in doc
        ? doc.summary
        : doc.layout?.find((block) => block.blockType === 'hero')?.description),
    alternates: { canonical: localizedPath(pathname, localeParam) },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: localeParam, path } = await params;
  if (!hasLocale(localeParam)) notFound();
  const segments = path ?? [];
  const locale: Locale = localeParam;
  const kindT = await getTranslations('contentKinds');
  const sectionT = await getTranslations('sections');
  const commonT = await getTranslations('common');
  const cmsT = await getTranslations('cms');
  if (segments.length === 1 && isContentKind(segments[0])) {
    const kind = segments[0];
    const rawPage = (await searchParams).page ?? '1';
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1) notFound();
    const result = await getEntries(kind, siteConfig.contentPageSize, page, locale);
    if (page > 1 && page > result.totalPages) notFound();
    return (
      <>
        <SectionHero
          section={kind}
          title={kindT(kind)}
          eyebrow={sectionT(`${kind}.question`)}
          description={sectionT(`${kind}.description`)}
        />
        <section className="archive mx-auto min-h-[40vh] w-[min(1200px,calc(100%_-_96px))] py-10 max-[760px]:w-[calc(100%_-_40px)]">
          {kind === 'research' && <ResearchDirection />}
          <EntryList entries={result.docs} />
          {kind === 'projects' && <SelectedProducts />}
          <nav
            className="pagination flex justify-between mt-[30px] text-[color:var(--accent)]"
            aria-label={commonT('pagination')}
          >
            {result.hasPrevPage && (
              <Link href={`/${kind}?page=${page - 1}`}>← {commonT('previous')}</Link>
            )}
            {result.hasNextPage && (
              <Link href={`/${kind}?page=${page + 1}`}>{commonT('next')} →</Link>
            )}
          </nav>
        </section>
      </>
    );
  }
  if (segments.length === 2 && isContentKind(segments[0])) {
    const entry = await getEntry(segments[0], segments[1], locale);
    if (!entry) notFound();
    return <EntryDetail entry={entry} />;
  }
  const pathname = `/${segments.join('/')}`;
  if (pathname === '/') return <IdealHome />;
  if (pathname === '/about') {
    return (
      <>
        <SectionHero
          section="about"
          title={cmsT('about.heroTitle')}
          eyebrow={cmsT('about.heroEyebrow')}
          description={cmsT('about.heroDescription')}
        />
        <section className="statement shell grid [grid-template-columns:minmax(160px,_0.5fr)_minmax(0,_1.5fr)_auto] items-start gap-[40px] [border-block:1px_solid_var(--line)] py-[45px] [margin-block:32px] w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:[grid-template-columns:1fr] max-[760px]:gap-[18px] max-[760px]:py-[32px] max-[760px]:w-[calc(100%_-_40px)] [&_h2]:text-[28px] [&_h2]:font-[500] [&_h2]:leading-[1.6] [&_div_p]:text-[13px] [&_div_p]:leading-[2] [&_div_p]:text-[color:var(--muted)] [&_div_p]:mt-[14px] max-[760px]:[&_h2]:text-[24px] max-[760px]:[&_>_span]:hidden">
          <p className="pt-[4px] text-[22px] font-[500] tracking-[0.01em] text-[color:var(--muted)]">
            {cmsT('about.statementEyebrow')}
          </p>
          <div className="max-w-[620px]">
            <h2>{cmsT('about.statementTitle')}</h2>
            <p>{cmsT('about.statementDescription')}</p>
          </div>
          <span
            className="justify-self-end text-[48px] text-[color:var(--accent)]"
            aria-hidden="true"
          >
            ✳
          </span>
        </section>
        <SocialMatrix />
      </>
    );
  }
  const page = await getPage(pathname, locale);
  if (!page || !page.layout?.length) notFound();
  return (
    <>
      <BlockRenderer blocks={page.layout} pagePath={pathname} />
    </>
  );
}
