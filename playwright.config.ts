import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL;
if (!baseURL) throw new Error('Missing required environment variable: TEST_BASE_URL');

/** 复用本地已启动的站点，避免自动化脚本擅自启动第二个数据库实例。 */
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
