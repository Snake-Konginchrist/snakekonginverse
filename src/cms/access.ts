import type { Access } from 'payload';

/** 后台用户才可写入；前台只能读取已发布文档，避免草稿经 REST API 泄露。 */
export const authenticated: Access = ({ req }) => Boolean(req.user);
export const published: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
export const publicRead: Access = () => true;
export const editorialAccess = {
  read: published,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
};
