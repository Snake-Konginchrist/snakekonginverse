import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeLocales } from 'payload';

test('CMS 请求省略语言时使用默认语言，同时保留关闭内容回退的设置', () => {
  const localization = {
    defaultLocale: 'en',
    fallback: false,
    localeCodes: ['en', 'zh-CN'],
    locales: [
      { code: 'en', label: 'English' },
      { code: 'zh-CN', label: '简体中文' },
    ],
  };
  // REST 的 URLSearchParams.get 会返回 null；Payload 的类型声明未包含空值。
  for (const locale of [undefined, null, '']) {
    assert.deepEqual(
      sanitizeLocales({ locale: locale as string, fallbackLocale: false, localization }),
      { locale: 'en', fallbackLocale: false },
    );
  }
  for (const locale of ['en', 'zh-CN', 'all', '*', 'unsupported']) {
    assert.deepEqual(sanitizeLocales({ locale, fallbackLocale: false, localization }), {
      locale: locale === '*' ? 'all' : locale,
      fallbackLocale: false,
    });
  }
});
