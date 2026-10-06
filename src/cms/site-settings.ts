import type { GlobalConfig } from 'payload';
import { authenticated, publicRead } from './access';
import { validLink } from './fields';
import siteConfig from '@/config/site.json';

/** 导航、品牌文案与配色统一从后台管理，组件不关心内容如何保存。 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '站点设置',
  access: { read: publicRead, update: authenticated },
  fields: [
    {
      name: 'brand',
      label: '品牌名称',
      type: 'text',
      required: true,
      defaultValue: siteConfig.brand,
    },
    {
      name: 'author',
      label: '英文姓名',
      type: 'text',
      required: true,
      defaultValue: siteConfig.author,
    },
    {
      name: 'description',
      label: '站点简介',
      type: 'textarea',
      required: true,
      defaultValue: siteConfig.description,
    },
    {
      name: 'accent',
      label: '强调色',
      type: 'select',
      defaultValue: siteConfig.accent,
      required: true,
      options: [
        { label: '轨道蓝', value: 'blue' },
        { label: '森林绿', value: 'green' },
        { label: '浆果紫', value: 'violet' },
      ],
    },
    {
      name: 'navigation',
      label: '导航',
      type: 'array',
      required: true,
      maxRows: 6,
      fields: [
        { name: 'label', label: '文字', type: 'text', required: true },
        { name: 'href', label: '链接', type: 'text', required: true, validate: validLink },
      ],
    },
    {
      name: 'socials',
      label: '社交链接',
      type: 'array',
      required: true,
      fields: [
        { name: 'label', label: '平台', type: 'text', required: true },
        { name: 'href', label: '链接', type: 'text', required: true, validate: validLink },
      ],
    },
  ],
};
