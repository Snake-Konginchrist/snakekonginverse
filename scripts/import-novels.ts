import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, basename, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  validateManifest,
  insideFile,
  readCover,
  parseArgs,
  checkPositions,
} from './novel-import-validation';

const args = process.argv.slice(2);
const directory = parseArgs(args);
if (args.includes('--help')) {
  console.info('pnpm import:novels <book-folder> [--init] [--publish] [--dry-run]');
  process.exit(0);
}
const folder = resolve(directory);
const manifestPath = resolve(folder, 'novel.json');
if (args.includes('--init')) {
  const files = (await readdir(folder))
    .filter((file) => /\.md$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (!files.length) throw new Error('No Markdown chapters found.');
  const manifest = {
    id: `n-${randomUUID().replaceAll('-', '').slice(0, 16)}`,
    title: basename(folder),
    language: 'zh-CN',
    chapters: files.map((file, index) => ({ file, id: `c-${String(index + 1).padStart(4, '0')}` })),
  };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  console.info('Created novel.json. Keep IDs stable; append new chapters with unused IDs.');
  process.exit(0);
}
const manifest = validateManifest(JSON.parse(await readFile(manifestPath, 'utf8')));
const ids = new Set<string>();
const chapters = await Promise.all(
  manifest.chapters.map(async (chapter, position) => {
    if (!/^c-[a-z0-9]+$/.test(chapter.id) || ids.has(chapter.id))
      throw new Error('Invalid or duplicate chapter ID');
    ids.add(chapter.id);
    const filename = await insideFile(folder, chapter.file);
    if (!/\.md$/i.test(filename)) throw new Error('Chapter must be Markdown');
    const source = (await readFile(filename, 'utf8')).replace(/^\uFEFF/, '');
    const heading = /^#[ \t]+(.+?)(?:\r?\n|$)/.exec(source);
    const title = chapter.title || heading?.[1] || basename(filename, extname(filename));
    const markdown = heading ? source.slice(heading[0].length).trim() : source.trim();
    if (!markdown) throw new Error(`Empty chapter: ${chapter.file}`);
    if (Buffer.byteLength(markdown) > 900_000)
      throw new Error(`Chapter too large: ${chapter.file}`);
    return {
      slug: chapter.id,
      title,
      markdown,
      position,
      ...(chapter.publishedAt ? { publishedAt: chapter.publishedAt } : {}),
    };
  }),
);
const cover = manifest.cover ? await readCover(folder, manifest.cover) : undefined;
console.info(
  `${manifest.title}: ${chapters.length} chapters; ${args.includes('--publish') ? 'publish' : 'draft'}`,
);
if (args.includes('--dry-run')) process.exit(0);
const base = new URL(process.env.NOVEL_SITE_URL || 'http://localhost:3000');
if (base.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(base.hostname))
  throw new Error('Remote imports require HTTPS');
const token = process.env.NOVEL_TOKEN;
if (!token) throw new Error('Set NOVEL_TOKEN to an administrator JWT');
async function request(path: string, method = 'GET', data?: unknown) {
  const response = await fetch(new URL(`/api/${path}`, base), {
    method,
    redirect: 'error',
    signal: AbortSignal.timeout(60_000),
    headers: {
      Authorization: `JWT ${token}`,
      ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: data instanceof FormData ? data : data === undefined ? undefined : JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error(
      `${method} ${path.split('?')[0]} failed (${response.status}): ${await response.text()}`,
    );
  return response.json();
}
await request('users/me');
const found = await request(`novels?where[slug][equals]=${manifest.id}&draft=true&limit=1`);
const existing = found.docs[0];
if (existing) {
  const remote = [];
  let page = 1;
  for (;;) {
    const result = await request(
      `chapters?where[novel][equals]=${existing.id}&draft=true&depth=0&limit=100&page=${page}`,
    );
    remote.push(...result.docs);
    if (!result.hasNextPage) break;
    page++;
  }
  checkPositions(chapters, remote);
}
if (args.includes('--publish') && existing)
  console.warn(
    'Publishing updates chapters individually. A failure may leave partially published changes; rerun the same manifest to resume.',
  );
let coverId = existing?.cover?.id ?? existing?.cover;
const bookData = {
  ...(manifest.completed !== undefined ? { completed: manifest.completed } : {}),
  ...(existing?.publishedAt || manifest.publishedAt
    ? { publishedAt: existing?.publishedAt || manifest.publishedAt }
    : {}),
  title: manifest.title,
  slug: manifest.id,
  description: manifest.description,
  language: manifest.language || 'zh-CN',
  ...(coverId ? { cover: coverId } : {}),
  ...(!existing ? { _status: 'draft' } : {}),
};
const book = existing
  ? (await request(`novels/${existing.id}?draft=true`, 'PATCH', bookData)).doc
  : (await request('novels', 'POST', bookData)).doc;
if (cover && !coverId) {
  const form = new FormData();
  form.set('file', cover, basename(manifest.cover!));
  form.set('_payload', JSON.stringify({ alt: manifest.title }));
  const uploaded = await request(
    `media?locale=${encodeURIComponent(manifest.language || 'zh-CN')}`,
    'POST',
    form,
  );
  coverId = uploaded.doc.id;
  try {
    await request(`novels/${book.id}?draft=true`, 'PATCH', { cover: coverId });
  } catch (error) {
    // 请求失败可能发生在服务端提交之后，不能贸然删除可能已被引用的封面。
    console.error(
      `Cover media ${coverId} uploaded, but attachment was not confirmed. Check this media and the book in the dashboard before retrying.`,
    );
    throw error;
  }
  Object.assign(bookData, { cover: coverId });
}
for (const chapter of chapters) {
  const query = `chapters?where[and][0][novel][equals]=${book.id}&where[and][1][slug][equals]=${chapter.slug}&draft=true&limit=1`;
  const old = (await request(query)).docs[0];
  const publish = args.includes('--publish');
  const data = {
    ...chapter,
    ...(old?.publishedAt ? { publishedAt: old.publishedAt } : {}),
    novel: book.id,
    _status: publish ? 'published' : 'draft',
  };
  await request(
    old
      ? `chapters/${old.id}${publish ? '' : '?draft=true'}`
      : `chapters${publish ? '' : '?draft=true'}`,
    old ? 'PATCH' : 'POST',
    data,
  );
  console.info(`${old ? 'Updated' : 'Created'} ${chapter.slug}: ${chapter.title}`);
}
if (args.includes('--publish'))
  await request(`novels/${book.id}`, 'PATCH', { ...bookData, _status: 'published' });
console.info(
  `Done: ${new URL(`/creations/novels/${manifest.id}`, base)}. Omitted chapters were not deleted.`,
);
