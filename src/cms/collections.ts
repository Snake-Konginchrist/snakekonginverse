import { cmsLabel } from './labels';
import type { CollectionConfig } from 'payload';
import { authenticated, editorialAccess, publicRead } from './access';
import { pageBlocks } from './blocks';
import { seo, validLink, validPagePath, validSlug } from './fields';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: cmsLabel('管理员'), plural: cmsLabel('管理员') },
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [{ name: 'name', label: cmsLabel('显示名称'), type: 'text', required: true }],
};

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: cmsLabel('媒体'), plural: cmsLabel('媒体库') },
  access: { read: publicRead, create: authenticated, update: authenticated, delete: authenticated },
  // 图片和缩略图统一存入 R2；仅允许栅格图片，避免上传可执行 SVG/HTML。
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [{ name: 'card', width: 960, height: 640, position: 'centre' }],
  },
  fields: [
    {
      name: 'alt',
      label: cmsLabel('图片描述（辅助阅读）'),
      type: 'text',
      required: true,
      localized: true,
    },
  ],
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: cmsLabel('页面'), plural: cmsLabel('页面搭建') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status'],
    preview: (data, { locale }) => `/${locale}/preview?collection=pages&id=${data.id}`,
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: cmsLabel('页面名称'), type: 'text', required: true, localized: true },
    {
      name: 'path',
      label: cmsLabel('访问路径'),
      type: 'text',
      unique: true,
      required: true,
      validate: validPagePath,
    },
    {
      name: 'layout',
      label: cmsLabel('页面区块（拖动排序）'),
      type: 'blocks',
      blocks: pageBlocks,
      required: true,
      localized: true,
    },
    { ...seo },
  ],
};

/** 内容实体与 Pages 分离，首页、列表和详情共享同一份已发布内容。 */
export const Entries: CollectionConfig = {
  slug: 'entries',
  labels: { singular: cmsLabel('作品 / 文章'), plural: cmsLabel('作品与文章') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', '_status'],
    preview: (data, { locale }) => `/${locale}/preview?collection=entries&id=${data.id}`,
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: cmsLabel('标题'), type: 'text', required: true, localized: true },
    {
      name: 'slug',
      label: cmsLabel('URL 标识'),
      type: 'text',
      required: true,
      unique: true,
      validate: validSlug,
    },
    {
      name: 'kind',
      label: cmsLabel('类型'),
      type: 'select',
      required: true,
      options: [
        { label: cmsLabel('实践'), value: 'projects' },
        { label: cmsLabel('求索'), value: 'research' },
        { label: cmsLabel('创作'), value: 'creations' },
        { label: cmsLabel('行记'), value: 'journal' },
      ],
    },
    { name: 'summary', label: cmsLabel('摘要'), type: 'textarea', required: true, localized: true },
    { name: 'cover', label: cmsLabel('封面'), type: 'upload', relationTo: 'media' },
    {
      name: 'tags',
      label: cmsLabel('标签'),
      type: 'array',
      fields: [{ name: 'label', label: cmsLabel('名称'), type: 'text', required: true }],
      localized: true,
    },
    { name: 'externalURL', label: cmsLabel('作品外链（可选）'), type: 'text', validate: validLink },
    { name: 'content', label: cmsLabel('正文'), type: 'richText', required: true, localized: true },
    { ...seo },
  ],
};
