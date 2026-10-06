import { expect, test } from '@playwright/test';
import type { Page } from '../../src/payload-types';

test('首页、栏目导航与移动端边界', async ({ page }, testInfo) => {
  await page.goto('/zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  await page.locator('.home-quick-link').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('技术项目');
  await expect(page.locator('.entry-grid, .empty-state')).toBeVisible();
});

test('四语言首页首屏使用 CMS 的已发布文案', async ({ page, request }) => {
  for (const locale of ['zh-CN', 'zh-TW', 'en', 'ja']) {
    const response = await request.get(`/api/pages?where[path][equals]=/&locale=${locale}`);
    expect(response.ok()).toBe(true);
    const { docs } = (await response.json()) as { docs: Page[] };
    const hero = docs[0].layout.find((block) => block.blockType === 'hero');
    if (!hero) throw new Error('首页缺少 CMS 首屏');
    await page.goto(`/${locale}`);
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(
      hero.title.replaceAll('\n', ''),
    );
    await expect(page.locator('.hero-description')).toHaveText(hero.description);
  }
});

test('未知页面、预览认证与公开写入保护', async ({ page, request }) => {
  const missing = await page.goto('/zh-CN/this-page-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByText('这片宇宙，还没有坐标。')).toBeVisible();
  await page.goto('/zh-CN/preview?collection=pages&id=1');
  await expect(page).toHaveURL(/\/admin\/(login|create-first-user)/);
  const write = await request.post('/api/pages', {
    data: { title: '未经授权的页面', path: '/forbidden' },
  });
  expect([401, 403]).toContain(write.status());
});

test('英语导航在桌面和手机使用相同译文，SEO 摘要有内容', async ({ page }, testInfo) => {
  await page.goto('/en');
  const mobile = testInfo.project.name === 'mobile';
  if (mobile) await page.locator('.mobile-nav > summary').click();
  const nav = page.locator(mobile ? '.mobile-nav nav' : '.desktop-nav');
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: '技术项目', exact: true })).toHaveCount(0);
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /\S.{20,}/);
  await expect(description).not.toHaveAttribute('content', 'EXPLORE');
});
