import assert from 'node:assert/strict';
import test from 'node:test';
import { detectLocale } from '../../src/i18n/detect-locale';

test('浏览器语言匹配支持地区、简繁文字和偏好权重', () => {
  for (const [header, expected] of [
    ['en-US,en;q=0.9', 'en'],
    ['ja-JP,en;q=0.8', 'ja'],
    ['zh-CN', 'zh-CN'],
    ['zh-SG', 'zh-CN'],
    ['zh-TW', 'zh-TW'],
    ['zh-HK', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
    ['zh-Hans', 'zh-CN'],
    ['en;q=0.5,ja;q=0.9', 'ja'],
    ['fr-FR,ja;q=0.8', 'ja'],
    ['ja;q=0,en;q=1', 'en'],
  ])
    assert.equal(detectLocale(header, 'en'), expected);
});

test('无语言、无效标签或不支持的语言使用英文', () => {
  for (const header of [null, '', '*', 'fr-FR', 'invalid_tag', 'ja;q=oops']) {
    assert.equal(detectLocale(header, 'en'), 'en');
  }
});
