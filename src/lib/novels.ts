import { cache } from 'react';
import { cms } from './content';

export const getNovels = cache(async () =>
  (await cms()).find({
    collection: 'novels',
    overrideAccess: false,
    pagination: false,
    sort: '-updatedAt',
  }),
);
export const getNovel = cache(async (slug: string) => {
  const result = await (
    await cms()
  ).find({
    collection: 'novels',
    where: { slug: { equals: slug } },
    overrideAccess: false,
    limit: 1,
  });
  return result.docs[0] ?? null;
});
export const getChapters = cache(async (novel: number) =>
  (await cms()).find({
    collection: 'chapters',
    where: { novel: { equals: novel } },
    overrideAccess: false,
    pagination: false,
    sort: ['position', 'slug'],
    depth: 0,
    select: { title: true, slug: true, position: true },
  }),
);
