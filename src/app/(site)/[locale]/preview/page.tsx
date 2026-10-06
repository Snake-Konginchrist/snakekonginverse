import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { cms } from '@/lib/content';
import { BlockRenderer } from '@/components/blocks/renderer';
import { EntryDetail } from '@/components/entry-detail';
import { hasLocale, type Locale } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('preview');
  return { title: t('title'), robots: { index: false, follow: false } };
}

/** 预览使用真实管理员会话，不接受公开 query token，也不开启全站草稿模式。 */
export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; id?: string }>;
}) {
  const payload = await cms();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect('/admin/login');
  const { collection, id } = await searchParams;
  if (!id || !/^\d+$/.test(id) || !['pages', 'entries'].includes(collection ?? '')) notFound();
  const t = await getTranslations('preview');
  const localeParam = await getLocale();
  const locale: Locale = hasLocale(localeParam) ? localeParam : 'zh-CN';
  const banner = (
    <aside className="preview-banner bg-[#fff0c9] text-[color:#55400d] p-[14px_20px] text-center text-[13px]">
      {t('banner')}
    </aside>
  );
  if (collection === 'pages') {
    const doc = await payload.findByID({
      collection: 'pages',
      id,
      locale,
      draft: true,
      overrideAccess: false,
      user,
      disableErrors: true,
    });
    if (!doc) notFound();
    return (
      <>
        {banner}
        <BlockRenderer blocks={doc.layout} pagePath={doc.path} />
      </>
    );
  }
  const doc = await payload.findByID({
    collection: 'entries',
    id,
    locale,
    draft: true,
    overrideAccess: false,
    user,
    disableErrors: true,
  });
  if (!doc) notFound();
  return (
    <>
      {banner}
      <EntryDetail entry={doc} />
    </>
  );
}
