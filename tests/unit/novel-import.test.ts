import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('小说清单使用稳定编号 数字排序 重复初始化不覆盖 支持离线校验', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'novel-import-'));
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ['--import', 'tsx', 'scripts/import-novels.ts', folder, ...args], {
      encoding: 'utf8',
    });
  try {
    await writeFile(join(folder, '10.md'), '# 第十章\n\n$$E=mc^2$$');
    await writeFile(join(folder, '2.md'), '# 第二章\n\n正文');
    assert.equal(run('--init').status, 0);
    const raw = await readFile(join(folder, 'novel.json'), 'utf8');
    const manifest = JSON.parse(raw);
    assert.match(manifest.id, /^n-[a-f0-9]{16}$/);
    assert.deepEqual(
      manifest.chapters.map((c: { file: string }) => c.file),
      ['2.md', '10.md'],
    );
    assert.notEqual(run('--init').status, 0);
    assert.equal(await readFile(join(folder, 'novel.json'), 'utf8'), raw);
    assert.equal(run('--dry-run').status, 0);
    manifest.chapters[1].id = manifest.chapters[0].id;
    await writeFile(join(folder, 'novel.json'), JSON.stringify(manifest));
    assert.notEqual(run('--dry-run').status, 0);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
