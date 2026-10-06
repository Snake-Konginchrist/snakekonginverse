import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 前台通过 CMS 同源文件接口读取 R2 图片，不开放任意远程图片主机。
  poweredByHeader: false,
  skipProxyUrlNormalize: true,
};

export default withPayload(withNextIntl(nextConfig));
