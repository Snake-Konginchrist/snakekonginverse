import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  // 同源部署前台与 CMS；图片只允许本地媒体，不开放任意远程主机。
  poweredByHeader: false,
};

export default withPayload(nextConfig);
