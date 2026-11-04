import assert from 'node:assert/strict';
import test from 'node:test';
import { newVisitor, validVisitor, visitKey } from '../../src/lib/novel-view-identity';
test('访客签名拒绝伪造，按上海日期和页面独立去重', () => {
  const token = newVisitor('test-secret');
  assert.ok(validVisitor(token, 'test-secret'));
  assert.equal(validVisitor(token, 'different-secret'), false);
  assert.equal(validVisitor(undefined, 'test-secret'), false);
  assert.equal(validVisitor('malformed', 'test-secret'), false);
  const morning = new Date('2026-11-05T00:00:00+08:00');
  const night = new Date('2026-11-05T23:59:59+08:00');
  const tomorrow = new Date('2026-11-06T00:00:00+08:00');
  assert.equal(visitKey(token, 'novel:1', morning), visitKey(token, 'novel:1', night));
  assert.notEqual(visitKey(token, 'novel:1', night), visitKey(token, 'novel:1', tomorrow));
  assert.notEqual(visitKey(token, 'chapter:1', morning), visitKey(token, 'novel:1', morning));
  assert.notEqual(
    visitKey(newVisitor('test-secret'), 'novel:1', morning),
    visitKey(token, 'novel:1', morning),
  );
});
