import assert from 'node:assert/strict';
import test from 'node:test';
import { createTranslator } from 'next-intl';
import zhCN from '../../messages/zh-CN.json';
import zhTW from '../../messages/zh-TW.json';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';

test('四语言的装饰文字正确显示花括号，不触发 ICU 参数解析错误', () => {
  for (const [locale, messages] of Object.entries({ 'zh-CN': zhCN, 'zh-TW': zhTW, en, ja })) {
    const t = createTranslator({
      locale,
      messages,
      onError: (error) => {
        throw error;
      },
    });
    assert.equal(t('portals.productsArt'), '{ idea → real }');
  }
});
