import type { CollectionConfig, AccessResult } from 'payload';
import { editorialAccess } from './access';
import { validSlug } from './fields';
import { preservePublicationDate } from './publication-date';

export const Novels: CollectionConfig = {
  slug: 'novels',
  labels: { singular: '小说', plural: '小说' },
  admin: { useAsTitle: 'title', group: '内容' },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: { beforeChange: [preservePublicationDate] },
  fields: [
    {
      name: 'publishedAt',
      type: 'date',
      label: '发布日期',
      admin: { description: '未填写时首次发布自动记录；已有日期保持不变。' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, validate: validSlug },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'language', type: 'text', required: true, defaultValue: 'zh-CN' },
    { name: 'completed', type: 'checkbox', defaultValue: false },
  ],
};

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  labels: { singular: '章节', plural: '小说章节' },
  admin: {
    useAsTitle: 'title',
    group: '内容',
    defaultColumns: ['title', 'novel', 'position', '_status'],
  },
  access: {
    ...editorialAccess,
    read: async ({ req }): Promise<AccessResult> => {
      if (req.user) return true;
      const books = await req.payload.find({
        collection: 'novels',
        where: { _status: { equals: 'published' } },
        pagination: false,
        depth: 0,
        overrideAccess: false,
        req,
      });
      return {
        and: [
          { _status: { equals: 'published' } },
          { novel: { in: books.docs.map((book) => book.id) } },
        ],
      };
    },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: { beforeChange: [preservePublicationDate] },
  indexes: [{ fields: ['novel', 'slug'], unique: true }],
  fields: [
    {
      name: 'publishedAt',
      type: 'date',
      label: '发布日期',
      admin: { description: '未填写时首次发布自动记录；已有日期保持不变。' },
    },
    { name: 'novel', type: 'relationship', relationTo: 'novels', required: true, index: true },
    { name: 'slug', type: 'text', required: true, validate: validSlug },
    { name: 'title', type: 'text', required: true },
    { name: 'position', type: 'number', required: true, min: 0 },
    {
      name: 'markdown',
      type: 'textarea',
      required: true,
      admin: { description: '支持 Markdown、$行内公式$ 和 $$独立公式$$。' },
    },
  ],
};
