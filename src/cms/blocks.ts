import { cmsLabel } from './labels';
import type { Block } from 'payload';
import { validLink } from './fields';
import siteConfig from '@/config/site.json';

/** 区块只描述内容和有限的设计选项，渲染由 components/blocks 独立负责。 */
const hero: Block = {
  slug: 'hero',
  labels: { singular: cmsLabel('个人首屏'), plural: cmsLabel('个人首屏') },
  fields: [
    { name: 'eyebrow', label: cmsLabel('身份标签'), type: 'text', required: true },
    { name: 'title', label: cmsLabel('个人主标题（换行分段）'), type: 'textarea', required: true },
    {
      name: 'description',
      label: cmsLabel('个人介绍与当前方向'),
      type: 'textarea',
      required: true,
    },
    { name: 'linkLabel', label: cmsLabel('按钮文字'), type: 'text', required: true },
    {
      name: 'href',
      label: cmsLabel('按钮链接'),
      type: 'text',
      required: true,
      validate: validLink,
    },
  ],
};
const portals: Block = {
  slug: 'portals',
  labels: { singular: cmsLabel('探索入口'), plural: cmsLabel('探索入口') },
  fields: [
    { name: 'title', label: cmsLabel('标题'), type: 'text', required: true },
    { name: 'description', label: cmsLabel('说明'), type: 'textarea' },
  ],
};
const collection: Block = {
  slug: 'collection',
  labels: { singular: cmsLabel('内容列表'), plural: cmsLabel('内容列表') },
  fields: [
    { name: 'title', label: cmsLabel('标题'), type: 'text', required: true },
    {
      name: 'source',
      label: cmsLabel('读取内容'),
      type: 'select',
      required: true,
      options: [
        { label: cmsLabel('实践'), value: 'projects' },
        { label: cmsLabel('求索'), value: 'research' },
        { label: cmsLabel('创作'), value: 'creations' },
        { label: cmsLabel('行记'), value: 'journal' },
      ],
    },
    {
      name: 'limit',
      label: cmsLabel('显示条数'),
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
  labels: { singular: cmsLabel('富文本'), plural: cmsLabel('富文本') },
  fields: [{ name: 'content', label: cmsLabel('正文'), type: 'richText', required: true }],
};
const statement: Block = {
  slug: 'statement',
  labels: { singular: cmsLabel('个人观点'), plural: cmsLabel('个人观点') },
  fields: [
    { name: 'eyebrow', label: cmsLabel('栏目标签'), type: 'text' },
    { name: 'title', label: cmsLabel('观点标题'), type: 'text', required: true },
    { name: 'description', label: cmsLabel('观点内容'), type: 'textarea', required: true },
  ],
};
export const pageBlocks: Block[] = [hero, portals, collection, text, statement];
