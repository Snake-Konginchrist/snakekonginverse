import { readFile, realpath, stat } from 'node:fs/promises';
import { relative, resolve, isAbsolute, extname } from 'node:path';
import sharp from 'sharp';
import site from '../src/config/site.json';

type Manifest = {
  id: string;
  title: string;
  description?: string;
  language?: string;
  cover?: string;
  completed?: boolean;
  publishedAt?: string;
  chapters: { file: string; id: string; title?: string; publishedAt?: string }[];
};
export function parseArgs(args: string[]): string {
  const flags = new Set(['--help', '--init', '--publish', '--dry-run']);
  for (const arg of args)
    if (arg.startsWith('-') && !flags.has(arg)) throw new Error(`Unknown option: ${arg}`);
  if (args.includes('--help')) return '';
  const dirs = args.filter((arg) => !arg.startsWith('-'));
  if (dirs.length !== 1) throw new Error('Specify exactly one book folder');
  if (args.includes('--init') && (args.includes('--publish') || args.includes('--dry-run')))
    throw new Error('--init cannot be combined with --publish or --dry-run');
  return dirs[0];
}
export function validateManifest(value: unknown): Manifest {
  const object = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object' && !Array.isArray(v);
  const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim();
  if (!object(value) || !text(value.id) || !/^n-[a-z0-9]+$/.test(value.id) || !text(value.title))
    throw new Error('Invalid book ID or title');
  for (const field of ['description', 'language', 'cover']) {
    if (
      value[field] !== undefined &&
      (typeof value[field] !== 'string' || (field !== 'description' && !text(value[field])))
    )
      throw new Error(`Invalid ${field}`);
  }
  if (!Array.isArray(value.chapters) || !value.chapters.length)
    throw new Error('Chapters must be a nonempty array');
  if (value.completed !== undefined && typeof value.completed !== 'boolean')
    throw new Error('completed must be a boolean');
  validatePublicationDate(value.publishedAt);
  const ids = new Set<string>();
  for (const chapter of value.chapters) {
    if (
      !object(chapter) ||
      !text(chapter.id) ||
      !/^c-[a-z0-9]+$/.test(chapter.id) ||
      ids.has(chapter.id) ||
      !text(chapter.file) ||
      (chapter.title !== undefined && !text(chapter.title))
    )
      throw new Error('Invalid chapter fields or duplicate chapter ID');
    validatePublicationDate(chapter.publishedAt);
    ids.add(chapter.id);
  }
  return value as Manifest;
}
export async function insideFile(folder: string, file: string): Promise<string> {
  const root = await realpath(folder);
  const target = await realpath(resolve(folder, file));
  const path = relative(root, target);
  if (
    !path ||
    path === '..' ||
    path.startsWith('../') ||
    path.startsWith('..\\') ||
    isAbsolute(path) ||
    !(await stat(target)).isFile()
  )
    throw new Error(`File must be inside the book folder: ${file}`);
  return target;
}
export async function readCover(folder: string, file: string): Promise<Blob> {
  const path = await insideFile(folder, file);
  const types: Record<string, string> = {
    '.jpg': 'jpeg',
    '.jpeg': 'jpeg',
    '.png': 'png',
    '.webp': 'webp',
    '.avif': 'heif',
  };
  const expected = types[extname(file).toLowerCase()];
  if (!expected) throw new Error('Unsupported cover format');
  if ((await stat(path)).size > site.uploadMaxFileSize)
    throw new Error(`Cover exceeds ${site.uploadMaxFileSize} bytes`);
  const buffer = await readFile(path);
  const image = sharp(buffer, { failOn: 'warning' });
  if ((await image.metadata()).format !== expected)
    throw new Error('Cover content does not match extension');
  await image.stats(); // 完整解码，拒绝仅有文件头或截断的图片。
  return new Blob([new Uint8Array(buffer)], {
    type: `image/${expected === 'heif' ? 'avif' : expected}`,
  });
}
export function checkPositions(
  local: { slug: string; position: number }[],
  remote: { slug: string; position: number }[],
) {
  const ids = new Set(local.map((chapter) => chapter.slug));
  const positions = new Set(local.map((chapter) => chapter.position));
  const conflicts = remote.filter(
    (chapter) => !ids.has(chapter.slug) && positions.has(chapter.position),
  );
  if (conflicts.length)
    throw new Error(
      `Chapter order conflicts with omitted chapters: ${conflicts.map((c) => c.slug).join(', ')}. Include the complete chapter list in novel.json.`,
    );
}

export function validatePublicationDate(value: unknown) {
  if (value === undefined) return;
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) ||
    !Number.isFinite(Date.parse(value))
  )
    throw new Error('publishedAt must be an ISO date-time with timezone');
  const day = value.slice(0, 10);
  if (new Date(day + 'T00:00:00Z').toISOString().slice(0, 10) !== day)
    throw new Error('Invalid publishedAt calendar date');
}
