import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { getPayload } from 'payload';
import sharp from 'sharp';
import config from '../src/payload.config';

/** 本机真实导入验证：独立管理员、小说及封面，finally 只清理本次创建的数据。 */
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname))
  throw new Error('Only local verification is allowed');
if (process.env.PAYLOAD_DB_PUSH === 'true')
  throw new Error('Disable schema push before verification');
const payload = await getPayload({ config });
await mkdir('test-results/novels', { recursive: true });
const folder = await mkdtemp(resolve('test-results/novels/import-'));
const nonce = randomUUID();
const email = `novel-qa-${nonce}@example.invalid`;
const password = randomUUID();
const coverName = `novel-qa-${nonce}.png`;
let userId: number | undefined;
let bookSlug: string | undefined;
let token = '';
const evidence: string[] = [];
function passed(message: string) {
  evidence.push(message);
  console.info(`PASS ${message}`);
}
async function api(path: string, method = 'GET', data?: unknown, authenticated = true) {
  return fetch(`${origin}/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? { Authorization: `JWT ${token}` } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}
async function json(path: string, authenticated = true) {
  const response = await api(path, 'GET', undefined, authenticated);
  assert.equal(response.status, 200, `${path}: ${await response.clone().text()}`);
  return response.json();
}
async function cli(...args: string[]) {
  await new Promise<void>((accept, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', 'scripts/import-novels.ts', folder, ...args],
      {
        env: { ...process.env, NOVEL_SITE_URL: origin, NOVEL_TOKEN: token },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let output = '';
    child.stdout.on('data', (value) => {
      output += value;
    });
    child.stderr.on('data', (value) => {
      output += value;
    });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? accept() : reject(new Error(`Import failed: ${output}`)),
    );
  });
}
const firstText =
  '# 第一章 星河来信\n\n这是一篇临时验证小说，用于检查 Markdown 与数学公式。验证完成后会清理。\n\n夜色落在窗沿，她翻开纸页。**故事从这里开始。**\n\n行内公式 $E=mc^2$，以及积分：\n\n$$\n\\int_0^1 x^2\\,dx=\\frac{1}{3}\n$$\n\n> 人与世界之间，还有未被写下的可能。\n\n## 手稿与坐标\n\n| 符号 | 含义 |\n| --- | --- |\n| $x$ | 距离 |\n| $t$ | 时间 |\n\n- 一封没有地址的信\n- 一段尚未开始的旅程\n\n<script>window.novelUnsafe = true</script>\n\n[不安全链接](javascript:alert(1))\n';
try {
  const user = await payload.create({
    collection: 'users',
    data: { email, password, name: '小说临时验证' },
  });
  userId = user.id;
  const login = await api('users/login', 'POST', { email, password }, false);
  assert.equal(login.status, 200);
  token = (await login.json()).token;
  await writeFile(resolve(folder, '001.md'), firstText);
  await writeFile(
    resolve(folder, '002.md'),
    '# 第二章 远方\n\n这是第二章，用于验证前后章导航。\n\n$$a^2+b^2=c^2$$\n',
  );
  await writeFile(
    resolve(folder, '003.md'),
    '# 第三章 归途\n\n这是第三章，用于验证目录顺序及最后一章的边界。\n',
  );
  await sharp('public/images/creations.png')
    .resize(600, 800, { fit: 'cover' })
    .png()
    .toFile(resolve(folder, coverName));
  await cli('--init');
  const manifest = JSON.parse(await readFile(resolve(folder, 'novel.json'), 'utf8'));
  bookSlug = manifest.id;
  manifest.title = '临时验证小说 · 星河手记';
  manifest.description =
    '关于一封信、一段旅程，以及人与世界之间尚未写下的可能。此书仅用于验证导入与阅读体验，验证后自动清理。';
  manifest.cover = coverName;
  await writeFile(resolve(folder, 'novel.json'), JSON.stringify(manifest));
  await cli('--dry-run');
  await cli();
  const draftBooks = await json(`novels?where[slug][equals]=${bookSlug}&draft=true`);
  assert.equal(draftBooks.totalDocs, 1);
  const bookId = draftBooks.docs[0].id;
  const chapterQuery = `chapters?where[novel][equals]=${bookId}&sort=position&draft=true`;
  assert.equal((await json(`novels?where[slug][equals]=${bookSlug}`, false)).totalDocs, 0);
  assert.equal((await json(chapterQuery, false)).totalDocs, 0);
  assert.equal((await fetch(`${origin}/creations/novels/${bookSlug}`)).status, 404);
  passed('Draft novels and chapters are private through API and page');
  await cli('--publish');
  await cli('--publish');
  const books = await json(`novels?where[slug][equals]=${bookSlug}`, false);
  const chapters = (await json(chapterQuery, false)).docs;
  assert.equal(books.totalDocs, 1);
  assert.equal(chapters.length, 3);
  assert.deepEqual(
    chapters.map((chapter: { slug: string }) => chapter.slug),
    ['c-0001', 'c-0002', 'c-0003'],
  );
  passed('Real CLI import and repeated publication preserve stable IDs without duplicates');
  const mediaId =
    typeof books.docs[0].cover === 'object' ? books.docs[0].cover.id : books.docs[0].cover;
  const media = await json(`media/${mediaId}?locale=zh-CN`, false);
  const image = await fetch(new URL(media.url, origin));
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type') || '', /^image\//);
  assert.ok((await image.arrayBuffer()).byteLength > 1000);
  passed('Local cover uploads to R2 and can be retrieved as a real image');
  const pagePath = `/creations/novels/${bookSlug}/c-0001`;
  const page = await fetch(`${origin}${pagePath}`);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /katex-mathml/);
  assert.match(html, /katex-display/);
  passed('Published reader renders inline and block formulas');
  await writeFile(resolve(folder, '001.md'), firstText + '\n仅在草稿中新增的标记\n');
  await cli();
  const publishedChapter = await json(`chapters/${chapters[0].id}`, false);
  assert.ok(!publishedChapter.markdown.includes('仅在草稿中新增的标记'));
  assert.ok(
    (await json(`chapters/${chapters[0].id}?draft=true`)).markdown.includes('仅在草稿中新增的标记'),
  );
  passed('Reimporting a published chapter as draft preserves its public text');
  await writeFile(resolve(folder, '001.md'), firstText);
  await cli('--publish');
  manifest.chapters.pop();
  await writeFile(resolve(folder, 'novel.json'), JSON.stringify(manifest));
  await cli('--publish');
  assert.equal((await json(chapterQuery)).totalDocs, 3);
  passed('Omitting a chapter from a subsequent import does not delete it');
  const unpublish = await api(`novels/${bookId}`, 'PATCH', { _status: 'draft' });
  assert.equal(unpublish.status, 200);
  assert.equal((await json(chapterQuery, false)).totalDocs, 0);
  assert.ok(
    [403, 404].includes((await api(`chapters/${chapters[0].id}`, 'GET', undefined, false)).status),
  );
  assert.equal((await fetch(`${origin}${pagePath}`)).status, 404);
  passed('Unpublishing the novel hides chapter URLs and direct chapter API reads');
  assert.equal((await api(`novels/${bookId}`, 'PATCH', { _status: 'published' })).status, 200);
  for (const collection of ['novels', 'chapters']) {
    const denied = await api(collection, 'POST', {}, false);
    assert.ok([401, 403].includes(denied.status));
  }
  passed('Anonymous clients cannot create novels or chapters');
  await writeFile(
    'test-results/novels/session.json',
    JSON.stringify({
      origin,
      bookSlug,
      bookId,
      chapterIds: chapters.map((chapter: { id: number }) => chapter.id),
      token,
    }),
    { mode: 0o600 },
  );
  await writeFile('test-results/novels/api-report.json', JSON.stringify(evidence, null, 2));
  if (process.argv.includes('--hold')) {
    console.info(
      'READY_FOR_VISUAL_QA: press Enter after browser verification to clean temporary data.',
    );
    const terminal = createInterface({ input: process.stdin, output: process.stdout });
    try {
      await terminal.question('');
    } finally {
      terminal.close();
    }
  }
} finally {
  // Exact generated identifiers only; never use a broad deletion filter.
  if (bookSlug) {
    const books = await payload.find({
      collection: 'novels',
      where: { slug: { equals: bookSlug } },
      draft: true,
      pagination: false,
      depth: 0,
    });
    for (const book of books.docs) {
      const chapters = await payload.find({
        collection: 'chapters',
        where: { novel: { equals: book.id } },
        draft: true,
        pagination: false,
        depth: 0,
      });
      for (const chapter of chapters.docs)
        await payload.delete({ collection: 'chapters', id: chapter.id });
      await payload.delete({ collection: 'novels', id: book.id });
    }
  }
  const media = await payload.find({
    collection: 'media',
    where: { filename: { equals: coverName } },
    pagination: false,
  });
  for (const file of media.docs) await payload.delete({ collection: 'media', id: file.id });
  if (userId) await payload.delete({ collection: 'users', id: userId });
  await rm('test-results/novels/session.json', { force: true });
  await rm(folder, { recursive: true, force: true });
  await payload.destroy();
  console.info('Temporary novel, chapters, versions, R2 cover and administrator cleaned.');
}
process.exit(0);
