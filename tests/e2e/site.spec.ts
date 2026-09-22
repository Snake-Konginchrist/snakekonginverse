import { expect, test } from '@playwright/test';

test('首页、栏目导航与移动端边界', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('把想象');
  await page.getByRole('link', { name: '探索我的宇宙' }).click();
  await expect(page).toHaveURL(/#explore$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  await page.locator('.portal-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('技术项目');
  await expect(page.getByText('故事，正在酝酿。')).toBeVisible();
});

test('未知页面、预览认证与公开写入保护', async ({ page, request }) => {
  const missing = await page.goto('/this-page-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByText('这片宇宙，还没有坐标。')).toBeVisible();
  await page.goto('/preview?collection=pages&id=1');
  await expect(page).toHaveURL(/\/admin\/(login|create-first-user)/);
  const write = await request.post('/api/pages', {
    data: { title: '未经授权的页面', path: '/forbidden' },
  });
  expect([401, 403]).toContain(write.status());
});
