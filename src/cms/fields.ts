import { cmsLabel, cmsError, type ValidationContext } from './labels';
import type { Field } from 'payload';

/** 统一 SEO 字段，页面和内容实体共享规则，而不共享业务状态。 */
export const seo: Field = {
  name: 'seo',
  label: cmsLabel('搜索引擎展示'),
  type: 'group',
  localized: true,
  fields: [
    { name: 'title', label: cmsLabel('SEO 标题'), type: 'text' },
    { name: 'description', label: cmsLabel('SEO 摘要'), type: 'textarea', maxLength: 180 },
  ],
};

/** 仅接受站内绝对路径和 HTTPS 链接，拒绝脚本协议及协议相对 URL。 */
export function validLink(value: unknown, options?: ValidationContext): true | string {
  if (!value) return true;
  if (typeof value !== 'string') return cmsError('请输入有效链接', options);
  if (/^\/(?!\/)[^\\\s]*$/.test(value)) return true;
  try {
    if (new URL(value).protocol === 'https:') return true;
  } catch {
    /* 由统一错误提示处理。 */
  }
  return cmsError('请使用 / 开头的站内路径或 https:// 链接', options);
}

/** 保留系统路由；统一小写路径避免大小写与尾斜线造成多个内容入口。 */
export function validPagePath(value: unknown, options?: ValidationContext): true | string {
  if (
    typeof value !== 'string' ||
    !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(value)
  ) {
    return cmsError('请填写 / 或 /about/me 形式的小写路径，不要以斜线结尾', options);
  }
  if (/^\/(admin|api|projects|research|creations|journal|preview|_next)(\/|$)/.test(value))
    return cmsError('此路径由系统保留', options);
  return true;
}

export function validSlug(value: unknown, options?: ValidationContext): true | string {
  return (
    (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
    cmsError('请使用小写字母、数字与连字符', options)
  );
}
