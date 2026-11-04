import type { CollectionBeforeChangeHook } from 'payload';

/** 已有发布日期保持稳定；草稿不自动计时，第一次发布才补齐。 */
export const preservePublicationDate: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  data.publishedAt =
    originalDoc?.publishedAt ||
    data.publishedAt ||
    (data._status === 'published' ? new Date().toISOString() : null);
  return data;
};
