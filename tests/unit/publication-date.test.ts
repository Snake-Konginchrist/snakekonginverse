import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePublicationDate } from '../../scripts/novel-import-validation';
import { preservePublicationDate } from '../../src/cms/publication-date';

test('发布日期要求真实日期和明确时区', () => {
  for (const value of [undefined, '2024-02-29T10:00:00+08:00', '2026-11-05T00:00:00Z'])
    assert.doesNotThrow(() => validatePublicationDate(value));
  for (const value of [null, 123, '', '2026-11-05', '2026-02-30T00:00:00Z', '2026-11-05T10:00:00'])
    assert.throws(() => validatePublicationDate(value));
});

test('草稿不自动设日期，首次发布计时，指定与重复导入保留日期', async () => {
  const run = async (data: Record<string, unknown>, originalDoc?: Record<string, unknown>) =>
    preservePublicationDate({ data, originalDoc } as Parameters<typeof preservePublicationDate>[0]);
  assert.equal((await run({ _status: 'draft' })).publishedAt, null);
  const published = await run({ _status: 'published' });
  assert.ok(Math.abs(Date.now() - Date.parse(published.publishedAt)) < 5000);
  const date = '2020-01-02T00:00:00Z';
  assert.equal((await run({ _status: 'draft', publishedAt: date })).publishedAt, date);
  assert.equal((await run({ _status: 'published' }, { publishedAt: date })).publishedAt, date);
  assert.equal(
    (
      await run(
        { _status: 'published', publishedAt: '2026-11-05T00:00:00Z' },
        { publishedAt: date },
      )
    ).publishedAt,
    date,
  );
  assert.equal(
    (await run({ _status: 'draft', publishedAt: null }, { publishedAt: date })).publishedAt,
    date,
  );
});
