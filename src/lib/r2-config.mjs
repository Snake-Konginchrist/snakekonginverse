/** R2 的 S3 兼容配置只在服务端读取；不提供本地存储回退。 */
function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`请在 .env 中填写 ${name}`);
  return value;
}

export function getR2Settings() {
  return {
    bucket: requiredEnv('R2_BUCKET'),
    config: {
      endpoint: requiredEnv('R2_ENDPOINT'),
      region: 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: requiredEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requiredEnv('R2_SECRET_ACCESS_KEY'),
      },
    },
  };
}

export function requireR2Settings() {
  const settings = getR2Settings();
  const required = {
    R2_BUCKET: settings.bucket,
    R2_ENDPOINT: settings.config.endpoint,
    R2_ACCESS_KEY_ID: settings.config.credentials.accessKeyId,
    R2_SECRET_ACCESS_KEY: settings.config.credentials.secretAccessKey,
  };
  for (const [key, value] of Object.entries(required)) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`请在 .env 中填写 ${key}`);
  }
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(settings.bucket)) {
    throw new Error('R2_BUCKET 必须是有效的 R2 存储桶名称。');
  }
  const endpoint = new URL(settings.config.endpoint);
  if (
    endpoint.protocol !== 'https:' ||
    !/^[a-f0-9]{32}(?:\.(eu|us|fedramp))?\.r2\.cloudflarestorage\.com$/.test(endpoint.hostname) ||
    endpoint.username ||
    endpoint.password ||
    endpoint.port ||
    endpoint.search ||
    endpoint.hash ||
    endpoint.pathname !== '/'
  ) {
    throw new Error('R2_ENDPOINT 必须是 Cloudflare 提供的 HTTPS S3 Endpoint。');
  }
  return settings;
}
