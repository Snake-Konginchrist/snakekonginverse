import assert from 'node:assert/strict';
import test from 'node:test';
import { validLink, validPagePath } from '../../src/cms/fields';

/** URL 输入是内容边界：防止脚本链接和保留路由被编辑器意外写入。 */
test('自定义路径支持根路径与多级页面', () => {
  for (const path of ['/', '/about', '/lab/ai-notes']) assert.equal(validPagePath(path), true);
});
test('系统路径、编码路径和歧义路径不可占用', () => {
  for (const path of [
    '/admin',
    '/api/users',
    '/projects/demo',
    '/preview',
    '/contact',
    '/links',
    '/changelog',
    '/contact/team',
    '/_next/static',
    '/about/',
    '/About',
    '//example.com',
    '/a?b',
    '/%61dmin',
  ])
    assert.notEqual(validPagePath(path), true);
});
test('链接仅允许站内路径和 HTTPS', () => {
  for (const path of ['/about', '/#explore', 'https://example.com'])
    assert.equal(validLink(path), true);
  for (const path of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//example.com',
    '/\\example.com',
    'http://example.com',
  ])
    assert.notEqual(validLink(path), true);
});
