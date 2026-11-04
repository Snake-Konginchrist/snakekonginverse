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

test('拒绝未知参数和会写文件的 dry-run 组合', async () => {
  const { parseArgs } = await import('../../scripts/novel-import-validation');
  assert.throws(() => parseArgs(['book', '--dry-ru']));
  assert.throws(() => parseArgs(['book', '--init', '--dry-run']));
  assert.throws(() => parseArgs(['book', '--init', '--publish']));
  assert.throws(() => parseArgs(['book', 'extra']));
  assert.equal(parseArgs(['--help']), '');
});

test('完整清单可重排，省略章节的位置冲突在写入前被拒绝', async () => {
  const { checkPositions, validateManifest } =
    await import('../../scripts/novel-import-validation');
  const remote = [
    { slug: 'c-1', position: 0 },
    { slug: 'c-2', position: 1 },
  ];
  assert.throws(() => checkPositions([{ slug: 'c-2', position: 0 }], remote));
  assert.doesNotThrow(() =>
    checkPositions(
      [
        { slug: 'c-2', position: 0 },
        { slug: 'c-1', position: 1 },
      ],
      remote,
    ),
  );
  assert.doesNotThrow(() => checkPositions([{ slug: 'c-1', position: 0 }], remote));
  for (const value of [
    null,
    { id: 'n-a', title: 1 },
    { id: 'n-a', title: '书', chapters: [{ id: 'c-a', file: 'a.md', title: {} }] },
  ])
    assert.throws(() => validateManifest(value));
});

test('拒绝越界链接、伪图片和超限封面，接受有效图片', async () => {
  const { insideFile, readCover } = await import('../../scripts/novel-import-validation');
  const { mkdir, symlink } = await import('node:fs/promises');
  const sharp = (await import('sharp')).default;
  const root = await mkdtemp(join(tmpdir(), 'novel-files-'));
  const folder = join(root, 'book');
  try {
    await mkdir(folder);
    await writeFile(join(root, 'outside.md'), '正文');
    await symlink(join(root, 'outside.md'), join(folder, 'linked.md'));
    await assert.rejects(insideFile(folder, 'linked.md'), /inside/);
    await writeFile(join(folder, 'fake.png'), 'not an image');
    await assert.rejects(readCover(folder, 'fake.png'));
    await writeFile(join(folder, 'large.png'), Buffer.alloc(10_000_001));
    await assert.rejects(readCover(folder, 'large.png'), /exceeds/);
    await sharp({ create: { width: 3, height: 4, channels: 3, background: 'red' } })
      .png()
      .toFile(join(folder, 'cover.png'));
    assert.equal((await readCover(folder, 'cover.png')).type, 'image/png');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
