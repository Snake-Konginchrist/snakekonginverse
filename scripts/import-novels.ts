import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, basename, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

// A persisted manifest gives books and chapters stable, non-name-based URLs.
type Manifest = {
  id: string;
  title: string;
  description?: string;
  language?: string;
  cover?: string;
  chapters: { file: string; id: string; title?: string }[];
};
const args = process.argv.slice(2);
const directory = args.find((arg) => !arg.startsWith('--'));
if (!directory || args.includes('--help')) {
  console.info(
    'pnpm import:novels <book-folder> [--init] [--publish] [--dry-run]\nSet NOVEL_SITE_URL and NOVEL_TOKEN (Payload administrator JWT). --init creates novel.json; edit it to set title, description, cover and chapter order.',
  );
  process.exit(directory ? 0 : 1);
}
const folder = resolve(directory);
const manifestPath = resolve(folder, 'novel.json');
if (args.includes('--init')) {
  const files = (await readdir(folder))
    .filter((file) => /\.md$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (!files.length) throw new Error('No Markdown chapters found.');
  const manifest: Manifest = {
    id: `n-${randomUUID().replaceAll('-', '').slice(0, 16)}`,
    title: basename(folder),
    language: 'zh-CN',
    chapters: files.map((file, index) => ({ file, id: `c-${String(index + 1).padStart(4, '0')}` })),
  };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  console.info('Created novel.json. Keep IDs stable; append new chapters with unused IDs.');
  process.exit(0);
}
const manifest: Manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (
  !/^n-[a-z0-9]+$/.test(manifest.id) ||
  !manifest.title?.trim() ||
  !Array.isArray(manifest.chapters) ||
  !manifest.chapters.length
)
  throw new Error('Invalid novel.json');
const ids = new Set<string>();
const chapters = await Promise.all(
  manifest.chapters.map(async (chapter, position) => {
    if (!/^c-[a-z0-9]+$/.test(chapter.id) || ids.has(chapter.id))
      throw new Error('Invalid or duplicate chapter ID');
    ids.add(chapter.id);
    const filename = resolve(folder, chapter.file);
    if (!filename.startsWith(folder + '/') || !/\.md$/i.test(filename))
      throw new Error('Chapter must be a Markdown file inside the book folder');
    const source = (await readFile(filename, 'utf8')).replace(/^\uFEFF/, '');
    const heading = /^#\s+(.+?)\r?\n/.exec(source);
    const title = chapter.title || heading?.[1] || basename(filename, extname(filename));
    const markdown = heading ? source.slice(heading[0].length).trim() : source.trim();
    if (!markdown) throw new Error(`Empty chapter: ${chapter.file}`);
    if (Buffer.byteLength(markdown) > 900_000)
      throw new Error(`Chapter too large: ${chapter.file}`);
    return { slug: chapter.id, title, markdown, position };
  }),
);
let cover: Blob | undefined;
if (manifest.cover) {
  const file = resolve(folder, manifest.cover);
  if (!file.startsWith(folder + '/')) throw new Error('Cover must be inside the book folder');
  const mime = (
    {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
    } as Record<string, string>
  )[extname(file).toLowerCase()];
  if (!mime) throw new Error('Unsupported cover format');
  cover = new Blob([new Uint8Array(await readFile(file))], { type: mime });
}
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
let coverId = existing?.cover?.id ?? existing?.cover;
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
}
const bookData = {
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
for (const chapter of chapters) {
  const query = `chapters?where[and][0][novel][equals]=${book.id}&where[and][1][slug][equals]=${chapter.slug}&draft=true&limit=1`;
  const old = (await request(query)).docs[0];
  const publish = args.includes('--publish');
  const data = { ...chapter, novel: book.id, _status: publish ? 'published' : 'draft' };
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
