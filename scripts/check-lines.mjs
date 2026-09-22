import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// 自动生成代码及迁移是工具产物，不手动拆分；手写业务文件严格控制在 300 行内。
const excluded = new Set(['node_modules', '.next', '.git', 'media', 'migrations']);
const generated = new Set(['payload-types.ts', 'importMap.ts', 'next-env.d.ts']);
const failures = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name) || generated.has(entry.name)) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(filename);
    else if (/\.(tsx?|mjs|css)$/.test(entry.name)) {
      const lines = (await readFile(filename, 'utf8')).trimEnd().split('\n').length;
      if (lines > 300) failures.push(`${filename}: ${lines} 行`);
    }
  }
}
await walk('.');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.info('全部手写代码文件不超过 300 行。');
