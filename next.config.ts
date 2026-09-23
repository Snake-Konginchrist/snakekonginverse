import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 同源部署前台与 CMS；图片只允许本地媒体，不开放任意远程主机。
  poweredByHeader: false,
};

export default withPayload(withNextIntl(nextConfig));
