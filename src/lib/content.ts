import 'server-only';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Locale } from '@/i18n/routing';

/** 仅缓存同一次服务端请求；发布后下一次访问立即读取新数据。 */
export const cms = cache(() => getPayload({ config }));
export const getSettings = cache(async (locale?: Locale) =>
  (await cms()).findGlobal({
    slug: 'site-settings',
    overrideAccess: false,
    ...(locale ? { locale } : {}),
  }),
);

export const getPage = cache(async (path: string, locale?: Locale) => {
  const result = await (
    await cms()
  ).find({
    collection: 'pages',
    where: { path: { equals: path } },
    limit: 1,
    overrideAccess: false,
    ...(locale ? { locale } : {}),
  });
  return result.docs[0] ?? null;
});

export const kinds = ['projects', 'creations', 'journal'] as const;
export type ContentKind = (typeof kinds)[number];
export function isContentKind(value: string): value is ContentKind {
  return kinds.some((kind) => kind === value);
}
export const kindLabels: Record<ContentKind, string> = {
  projects: '技术项目',
  creations: '同人创作',
  journal: '文字手记',
};

/** 显式启用访问控制：Payload Local API 默认绕过权限，不能用于公开查询。 */
export async function getEntries(kind: ContentKind, limit = 9, page = 1, locale?: Locale) {
  return (await cms()).find({
    collection: 'entries',
    where: { kind: { equals: kind } },
    sort: '-createdAt',
    limit,
    page,
    overrideAccess: false,
    ...(locale ? { locale } : {}),
  });
}
export async function getEntry(kind: ContentKind, slug: string, locale?: Locale) {
  const result = await (
    await cms()
  ).find({
    collection: 'entries',
    where: { and: [{ kind: { equals: kind } }, { slug: { equals: slug } }] },
    limit: 1,
    overrideAccess: false,
    ...(locale ? { locale } : {}),
  });
  return result.docs[0] ?? null;
}
