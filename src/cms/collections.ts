import path from 'node:path';
import type { CollectionConfig } from 'payload';
import { authenticated, editorialAccess, publicRead } from './access';
import { pageBlocks } from './blocks';
import { seo, validLink, validPagePath } from './fields';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理员', plural: '管理员' },
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [{ name: 'name', label: '显示名称', type: 'text', required: true }],
};

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '媒体', plural: '媒体库' },
  access: { read: publicRead, create: authenticated, update: authenticated, delete: authenticated },
  // 生产使用独立持久化目录；仅允许栅格图片，避免上传可执行 SVG/HTML。
  upload: {
    // 媒体由运行环境提供，不属于打包输入；避免追踪整个项目目录。
    staticDir: path.resolve(/* turbopackIgnore: true */ process.env.MEDIA_DIR || 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [{ name: 'card', width: 960, height: 640, position: 'centre' }],
  },
  fields: [{ name: 'alt', label: '图片描述（辅助阅读）', type: 'text', required: true }],
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '页面', plural: '页面搭建' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status'],
    preview: (data) => `/preview?collection=pages&id=${data.id}`,
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: '页面名称', type: 'text', required: true },
    {
      name: 'path',
      label: '访问路径',
      type: 'text',
      unique: true,
      required: true,
      validate: validPagePath,
    },
    {
      name: 'layout',
      label: '页面区块（拖动排序）',
      type: 'blocks',
      blocks: pageBlocks,
      required: true,
    },
    seo,
  ],
};

/** 内容实体与 Pages 分离，首页、列表和详情共享同一份已发布内容。 */
export const Entries: CollectionConfig = {
  slug: 'entries',
  labels: { singular: '作品 / 文章', plural: '作品与文章' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', '_status'],
    preview: (data) => `/preview?collection=entries&id=${data.id}`,
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: '标题', type: 'text', required: true },
    {
      name: 'slug',
      label: 'URL 标识',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        '请使用小写字母、数字与连字符',
    },
    {
      name: 'kind',
      label: '类型',
      type: 'select',
      required: true,
      options: [
        { label: '技术项目', value: 'projects' },
        { label: '同人创作', value: 'creations' },
        { label: '文字手记', value: 'journal' },
      ],
    },
    { name: 'summary', label: '摘要', type: 'textarea', required: true },
    { name: 'cover', label: '封面', type: 'upload', relationTo: 'media' },
    {
      name: 'tags',
      label: '标签',
      type: 'array',
      fields: [{ name: 'label', label: '名称', type: 'text', required: true }],
    },
    { name: 'externalURL', label: '作品外链（可选）', type: 'text', validate: validLink },
    { name: 'content', label: '正文', type: 'richText', required: true },
    seo,
  ],
};
