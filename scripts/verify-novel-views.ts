import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { getPayload } from 'payload';
import config from '../src/payload.config';
import { visitKey } from '../src/lib/novel-view-identity';
import { viewCounts } from '../src/lib/novel-views';
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname))
  throw new Error('Local verification only');
const payload = await getPayload({ config });
const slug = `n-${randomUUID().replaceAll('-', '')}`;
let bookId: number | undefined;
const chapterIds: number[] = [];
const visitors: string[] = [];
const targets: string[] = [];
async function post(cookie = '', chapter?: string, extra: Record<string, string> = {}) {
  return fetch(`${origin}/api/novel-views`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: cookie, ...extra },
    body: JSON.stringify({ book: slug, ...(chapter ? { chapter } : {}) }),
  });
}
try {
  const book = await payload.create({
    collection: 'novels',
    data: { slug, title: '浏览量集成验证', language: 'zh-CN', _status: 'draft' },
  });
  bookId = book.id;
  targets.push(`novel:${book.id}`);
  assert.equal((await post()).status, 404);
  await payload.update({ collection: 'novels', id: book.id, data: { _status: 'published' } });
  for (const chapter of ['c-1', 'c-2']) {
    const c = await payload.create({
      collection: 'chapters',
      data: {
        slug: chapter,
        title: chapter,
        novel: book.id,
        position: chapterIds.length,
        markdown: '临时验证正文',
        _status: 'published',
      },
    });
    chapterIds.push(c.id);
    targets.push(`chapter:${c.id}`);
  }
  assert.equal((await post('', undefined, { Origin: 'https://other.example' })).status, 403);
  assert.equal((await post('', 'c-missing')).status, 404);
  const first = await post();
  assert.equal(first.status, 200);
  assert.equal((await first.json()).retry, true);
  const cookie = first.headers.get('set-cookie')!.split(';')[0];
  visitors.push(cookie.slice(cookie.indexOf('=') + 1));
  assert.deepEqual(await viewCounts(payload, targets), {});
  await Promise.all(Array.from({ length: 12 }, () => post(cookie, 'c-1')));
  let counts = await viewCounts(payload, targets);
  assert.equal(counts[targets[0]], 1);
  assert.equal(counts[targets[1]], 1);
  await post(cookie);
  await post(cookie, 'c-2');
  counts = await viewCounts(payload, targets);
  assert.deepEqual(counts, { [targets[0]]: 1, [targets[1]]: 1, [targets[2]]: 1 });
  const second = await post();
  const cookie2 = second.headers.get('set-cookie')!.split(';')[0];
  visitors.push(cookie2.slice(cookie2.indexOf('=') + 1));
  await post(cookie2, 'c-1');
  counts = await viewCounts(payload, targets);
  assert.equal(counts[targets[0]], 2);
  assert.equal(counts[targets[1]], 2);
  await payload.update({
    collection: 'chapters',
    id: chapterIds[0],
    draft: true,
    data: { markdown: '新草稿' },
  });
  await payload.update({
    collection: 'chapters',
    id: chapterIds[0],
    data: { markdown: '重新发布', _status: 'published' },
  });
  assert.equal((await viewCounts(payload, targets))[targets[1]], 2);
  for (const route of [`/creations/novels/${slug}`, `/creations/novels/${slug}/c-1`]) {
    const r = await fetch(origin + route);
    assert.equal(r.status, 200);
    assert.match(await r.text(), /novel-view-count/);
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: 'zh-CN',
    });
    const page = await context.newPage();
    await page.goto(`${origin}/creations/novels/${slug}/c-1`);
    await page.locator('.novel-view-count').filter({ hasText: '3' }).waitFor();
    const visitor = (await context.cookies()).find((cookie) => cookie.name === 'novel_visitor');
    assert.ok(visitor);
    visitors.push(visitor.value);
    await page.reload();
    await page.waitForResponse(
      (response) => response.url().endsWith('/api/novel-views') && response.status() === 200,
    );
    assert.equal((await viewCounts(payload, targets))[targets[1]], 3);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mkdir('test-results/novels', { recursive: true });
    await page.screenshot({ path: 'test-results/novels/views-mobile.png' });
    await page.goto(`${origin}/creations/novels/${slug}`);
    await page.waitForResponse(
      (response) => response.url().endsWith('/api/novel-views') && response.status() === 200,
    );
    assert.equal((await viewCounts(payload, targets))[targets[0]], 3);
    console.log(
      'PASS: real mobile browser counts once, reload and returning to book do not double count; no horizontal overflow',
    );
  } finally {
    await browser.close();
  }
  const internal = await fetch(`${origin}/api/novel-view-totals`);
  assert.ok([401, 403].includes(internal.status));
  await payload.update({ collection: 'novels', id: book.id, data: { _status: 'draft' } });
  assert.equal((await post(cookie2, 'c-1')).status, 404);
  console.log(
    'PASS: handshake, 12 concurrent refreshes, novel/chapter dedupe, distinct visitors, draft privacy, republish preservation, front-end markup and private stats API',
  );
} finally {
  for (const id of chapterIds) await payload.delete({ collection: 'chapters', id });
  if (bookId) await payload.delete({ collection: 'novels', id: bookId });
  if (targets.length)
    await payload.delete({ collection: 'novel-view-totals', where: { target: { in: targets } } });
  const keys = visitors.flatMap((visitor) => targets.map((target) => visitKey(visitor, target)));
  if (keys.length)
    await payload.delete({ collection: 'novel-view-visits', where: { key: { in: keys } } });
  await payload.destroy();
}
process.exit(0);
