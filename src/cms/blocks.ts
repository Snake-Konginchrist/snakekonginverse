import type { Block } from 'payload';
import { validLink } from './fields';
import siteConfig from '@/config/site.json';

/** 区块只描述内容和有限的设计选项，渲染由 components/blocks 独立负责。 */
const hero: Block = {
  slug: 'hero',
  labels: { singular: '品牌首屏', plural: '品牌首屏' },
  fields: [
    { name: 'eyebrow', label: '眉题', type: 'text', required: true },
    { name: 'title', label: '主标题（换行分段）', type: 'textarea', required: true },
    { name: 'description', label: '简介', type: 'textarea', required: true },
    { name: 'linkLabel', label: '按钮文字', type: 'text', required: true },
    { name: 'href', label: '按钮链接', type: 'text', required: true, validate: validLink },
  ],
};
const portals: Block = {
  slug: 'portals',
  labels: { singular: '探索入口', plural: '探索入口' },
  fields: [
    { name: 'title', label: '标题', type: 'text', required: true },
    { name: 'description', label: '说明', type: 'textarea' },
  ],
};
const collection: Block = {
  slug: 'collection',
  labels: { singular: '内容列表', plural: '内容列表' },
  fields: [
    { name: 'title', label: '标题', type: 'text', required: true },
    {
      name: 'source',
      label: '读取内容',
      type: 'select',
      required: true,
      options: [
        { label: '技术项目', value: 'projects' },
        { label: '同人创作', value: 'creations' },
        { label: '文字手记', value: 'journal' },
      ],
    },
    {
      name: 'limit',
      label: '显示条数',
      type: 'number',
      min: 1,
      max: 12,
      required: true,
      defaultValue: siteConfig.collectionDefaultLimit,
    },
  ],
};
const text: Block = {
  slug: 'text',
  labels: { singular: '富文本', plural: '富文本' },
  fields: [{ name: 'content', label: '正文', type: 'richText', required: true }],
};
const statement: Block = {
  slug: 'statement',
  labels: { singular: '个人宣言', plural: '个人宣言' },
  fields: [
    { name: 'eyebrow', label: '眉题', type: 'text' },
    { name: 'title', label: '标题', type: 'text', required: true },
    { name: 'description', label: '正文', type: 'textarea', required: true },
  ],
};
export const pageBlocks: Block[] = [hero, portals, collection, text, statement];
