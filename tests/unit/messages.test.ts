import assert from 'node:assert/strict';
import test from 'node:test';
import { createTranslator } from 'next-intl';
import zhCN from '../../messages/zh-CN.json';
import zhTW from '../../messages/zh-TW.json';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';
import ko from '../../messages/ko.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import pt from '../../messages/pt.json';
import ru from '../../messages/ru.json';

const supportedMessages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en,
  ja,
  ko,
  es,
  fr,
  de,
  pt,
  ru,
};

test('十种语言的装饰文字正确显示花括号，不触发 ICU 参数解析错误', () => {
  for (const [locale, messages] of Object.entries(supportedMessages)) {
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

function messagePaths(value: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(value)
    .flatMap(([key, child]) =>
      typeof child === 'string'
        ? [`${prefix}${key}`]
        : messagePaths(child as Record<string, unknown>, `${prefix}${key}.`),
    )
    .sort();
}

test('十种语言有完整相同的键，所有文案可解析且不缺翻译', () => {
  const expected = messagePaths(zhCN);
  for (const [locale, messages] of Object.entries(supportedMessages)) {
    assert.deepEqual(messagePaths(messages), expected, locale);
    const t = createTranslator({
      locale,
      messages,
      onError: (error) => {
        throw error;
      },
    });
    for (const key of expected) {
      assert.ok(
        t(key as Parameters<typeof t>[0], {
          brand: 'SnakeKonginverse',
          section: 'Projects',
          kind: 'Projects',
        }).trim(),
        `${locale}: ${key}`,
      );
    }
  }
});
