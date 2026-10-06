import { cmsLabel } from './labels';
import type { GlobalConfig } from 'payload';
import { authenticated, publicRead } from './access';
import { validLink } from './fields';
import siteConfig from '@/config/site.json';

/** 导航、品牌文案与配色统一从后台管理，组件不关心内容如何保存。 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: cmsLabel('站点设置'),
  admin: { group: '站点' },
  access: { read: publicRead, update: authenticated },
  fields: [
    {
      name: 'brand',
      label: cmsLabel('品牌名称'),
      type: 'text',
      required: true,
      defaultValue: siteConfig.brand,
    },
    {
      name: 'author',
      label: cmsLabel('英文姓名'),
      type: 'text',
      required: true,
      defaultValue: siteConfig.author,
    },
    {
      name: 'description',
      localized: true,
      label: cmsLabel('站点简介'),
      type: 'textarea',
      required: true,
    },
    {
      name: 'accent',
      label: cmsLabel('强调色'),
      type: 'select',
      defaultValue: siteConfig.accent,
      required: true,
      options: [
        { label: cmsLabel('轨道蓝'), value: 'blue' },
        { label: cmsLabel('森林绿'), value: 'green' },
        { label: cmsLabel('浆果紫'), value: 'violet' },
      ],
    },
    {
      name: 'navigation',
      label: cmsLabel('导航'),
      type: 'array',
      required: true,
      maxRows: 12,
      fields: [
        { name: 'label', label: cmsLabel('文字'), type: 'text', required: true, localized: true },
        {
          name: 'href',
          label: cmsLabel('链接'),
          type: 'text',
          required: true,
          validate: validLink,
        },
      ],
    },
    {
      name: 'socials',
      label: cmsLabel('社交链接'),
      type: 'array',
      required: true,
      fields: [
        { name: 'label', label: cmsLabel('平台'), type: 'text', required: true, localized: true },
        {
          name: 'href',
          label: cmsLabel('链接'),
          type: 'text',
          required: true,
          validate: validLink,
        },
      ],
    },
  ],
};
