import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { cms } from '@/lib/content';
import { BlockRenderer } from '@/components/blocks/renderer';
import { EntryDetail } from '@/components/entry-detail';

export const metadata: Metadata = { title: '草稿预览', robots: { index: false, follow: false } };

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
  const banner = (
    <aside className="preview-banner">草稿预览 · 仅登录管理员可见 · 关闭此页返回编辑器</aside>
  );
  if (collection === 'pages') {
    const doc = await payload.findByID({
      collection: 'pages',
      id,
      draft: true,
      overrideAccess: false,
      user,
      disableErrors: true,
    });
    if (!doc) notFound();
    return (
      <>
        {banner}
        <BlockRenderer blocks={doc.layout} />
      </>
    );
  }
  const doc = await payload.findByID({
    collection: 'entries',
    id,
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
