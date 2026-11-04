import type { CollectionConfig } from 'payload';
const deny = () => false;
const access = { read: deny, create: deny, update: deny, delete: deny };
// 统计独立存储，不进入正文版本，重新导入或恢复草稿不会重置计数。
export const NovelViewTotals: CollectionConfig = {
  slug: 'novel-view-totals',
  admin: { hidden: true },
  access,
  fields: [
    { name: 'target', type: 'text', required: true, unique: true },
    { name: 'views', type: 'number', required: true, defaultValue: 0 },
  ],
};
export const NovelViewVisits: CollectionConfig = {
  slug: 'novel-view-visits',
  admin: { hidden: true },
  access,
  fields: [{ name: 'key', type: 'text', required: true, unique: true }],
};
