import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import en from '../../messages/en.json' with { type: 'json' };
import zh from '../../messages/zh-CN.json' with { type: 'json' };

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([{ name: 'NEXT_LOCALE', value: 'zh-CN', url: baseURL! }]);
});

test('首页、栏目导航与移动端边界', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole('region', { name: zh.ideal.primary }).getByRole('link').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(zh.contentKinds.projects);
  await expect(page.locator('.entry-grid, .empty-state')).toBeVisible();
});

test('十语言首页展示当前品牌文案且公开 URL 不带语言前缀', async ({ page, context, baseURL }) => {
  for (const locale of ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru']) {
    const messages = JSON.parse(
      await readFile(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'),
    );
    await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, url: baseURL! }]);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(
      messages.ideal.title + messages.ideal.accent,
    );
    await expect(page.locator('.ideal-intro')).toHaveText(messages.ideal.description);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    expect(new URL(page.url()).pathname).toBe('/');
  }
});

test('未知页面、预览认证与公开写入保护', async ({ page, request }) => {
  const missing = await page.goto('/this-page-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: zh.errors.notFoundTitle })).toBeVisible();
  await page.goto('/preview?collection=pages&id=1');
  await expect(page).toHaveURL(/\/admin\/(login|create-first-user)/);
  const write = await request.post('/api/pages', {
    data: { title: '未经授权的页面', path: '/forbidden' },
  });
  expect([401, 403]).toContain(write.status());
});

test('英语导航在桌面和手机使用相同译文，SEO 摘要有内容', async ({
  page,
  context,
  baseURL,
}, testInfo) => {
  await context.addCookies([{ name: 'NEXT_LOCALE', value: 'en', url: baseURL! }]);
  await page.goto('/');
  const mobile = testInfo.project.name === 'mobile';
  if (mobile) await page.locator('.mobile-nav > summary').click();
  const nav = page.locator(mobile ? '.mobile-nav nav' : '.desktop-nav');
  await expect(nav.getByRole('link', { name: en.navigation.projects, exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: zh.navigation.projects, exact: true })).toHaveCount(0);
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /\S.{20,}/);
  await expect(description).not.toHaveAttribute('content', 'EXPLORE');
});
