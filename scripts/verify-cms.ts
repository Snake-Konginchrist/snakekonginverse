import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { getPayload } from 'payload';
import config from '../src/payload.config';
import sharp from 'sharp';
import { chromium, expect } from '@playwright/test';
import { requiredEnv } from '../src/lib/env';

/** 使用临时管理员与临时内容验证真实 HTTP 流程；finally 清理，不留下演示数据。 */
const origin = requiredEnv('TEST_BASE_URL');
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) {
  throw new Error('集成验证只允许本机站点，禁止对生产站点创建测试帐号。');
}
const payload = await getPayload({ config });
const nonce = randomUUID();
const email = `verify-${nonce}@example.invalid`;
const password = randomUUID();
let userId: number | undefined;
let entryId: number | undefined;
let pageId: number | undefined;
let secondPageId: number | undefined;
let mediaId: number | undefined;
try {
  const user = await payload.create({
    collection: 'users',
    data: { email, password, name: '临时集成验证' },
  });
  userId = user.id;
  const login = await fetch(`${origin}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const headers = { 'Content-Type': 'application/json', Authorization: `JWT ${token}` };
  const slug = `verify-${nonce}`;
  const content = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          children: [
            {
              type: 'text',
              text: '真实发布闭环验证正文',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
        },
      ],
    },
  };
  const created = await fetch(`${origin}/api/entries?draft=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: '临时草稿验证',
      slug,
      kind: 'journal',
      summary: '自动化验证后删除',
      content,
      _status: 'draft',
    }),
  });
  assert.equal(created.status, 201);
  entryId = (await created.json()).doc.id;
  const publicQuery = await fetch(`${origin}/api/entries?where[slug][equals]=${slug}`);
  assert.equal((await publicQuery.json()).totalDocs, 0, '公开 API 不得返回草稿');
  assert.equal((await fetch(`${origin}/journal/${slug}`)).status, 404);
  const preview = await fetch(`${origin}/preview?collection=entries&id=${entryId}`, {
    headers: { Cookie: `payload-token=${token}` },
  });
  assert.equal(preview.status, 200);
  assert.match(await preview.text(), /真实发布闭环验证正文/);
  const publish = await fetch(`${origin}/api/entries/${entryId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ _status: 'published' }),
  });
  assert.equal(publish.status, 200);
  const published = await fetch(`${origin}/journal/${slug}`);
  assert.equal(published.status, 200);
  assert.match(await published.text(), /真实发布闭环验证正文/);

  // 自定义嵌套 URL 必须由 CMS 真正控制，不能仅存在于 schema 定义中。
  const page = await fetch(`${origin}/api/pages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: '临时页面',
      path: `/lab/${slug}`,
      _status: 'published',
      layout: [
        { blockType: 'statement', title: '嵌套页面验证', description: '区块数据来自 PostgreSQL' },
      ],
    }),
  });
  assert.equal(page.status, 201);
  pageId = (await page.json()).doc.id;
  assert.match(await (await fetch(`${origin}/lab/${slug}`)).text(), /区块数据来自 PostgreSQL/);
  const reserved = await fetch(`${origin}/api/pages/${pageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ path: '/admin' }),
  });
  assert.equal(reserved.status, 400, '后台不可占用系统保留路由');
  const secondPage = await fetch(`${origin}/api/pages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: '临时路径约束验证',
      path: `/lab/${slug}-second`,
      _status: 'published',
      layout: [{ blockType: 'statement', title: '唯一性验证', description: '验证后删除' }],
    }),
  });
  assert.equal(secondPage.status, 201);
  secondPageId = (await secondPage.json()).doc.id;
  const duplicate = await fetch(`${origin}/api/pages/${secondPageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ path: `/lab/${slug}` }),
  });
  assert.equal(duplicate.status, 400, '路径唯一性由数据库和 CMS 共同保护');
  // 媒体走真实 multipart 上传，验证文件落盘与公开读取，随后删除。
  const buffer = await sharp({
    create: { width: 16, height: 16, channels: 3, background: '#254ce5' },
  })
    .png()
    .toBuffer();
  const form = new FormData();
  form.append('_payload', JSON.stringify({ alt: '临时媒体验证' }));
  form.append('file', new Blob([new Uint8Array(buffer)], { type: 'image/png' }), `${nonce}.png`);
  const upload = await fetch(`${origin}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  assert.equal(upload.status, 201);
  const media = (await upload.json()).doc;
  mediaId = media.id;
  assert.equal((await fetch(new URL(media.url, origin))).status, 200);

  // 实际打开后台编辑器，确认官方 importMap 与富文本客户端组件可正常加载。
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addCookies([{ name: 'payload-token', value: token, url: origin }]);
    const editor = await context.newPage();
    await editor.goto(`${origin}/admin/collections/entries/${entryId}`);
    await expect(editor.locator('[contenteditable="true"]').first()).toBeVisible();
    await editor.screenshot({ path: 'test-results/admin-editor.png', fullPage: true });
  } finally {
    await browser.close();
  }
  console.info(
    'CMS 闭环通过：登录、草稿隔离、认证预览、发布、正文、嵌套 URL、路径约束、媒体上传及后台编辑器。',
  );
} finally {
  if (entryId) await payload.delete({ collection: 'entries', id: entryId });
  if (pageId) await payload.delete({ collection: 'pages', id: pageId });
  if (secondPageId) await payload.delete({ collection: 'pages', id: secondPageId });
  if (mediaId) await payload.delete({ collection: 'media', id: mediaId });
  if (userId) await payload.delete({ collection: 'users', id: userId });
  await payload.destroy();
}
// 清理完成后结束一次性 CLI；失败会在到达此行前抛出，保持非零退出状态。
process.exit(0);
