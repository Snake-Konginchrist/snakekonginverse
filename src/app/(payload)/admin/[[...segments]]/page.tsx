import config from '@payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';

/** CMS 捕获式路由由官方视图处理，业务代码不复刻登录和编辑器。 */
type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};
export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams });
export default function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap });
}
