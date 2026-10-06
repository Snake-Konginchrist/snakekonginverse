import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requireR2Settings } from '../../src/lib/r2-config.mjs';

const keys = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const;

test('R2 配置拒绝缺失密钥和非 Cloudflare 地址，不回退本地存储', () => {
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.R2_BUCKET = 'snakekonginverse-media';
    process.env.R2_ENDPOINT = `https://${'a'.repeat(32)}.r2.cloudflarestorage.com`;
    process.env.R2_ACCESS_KEY_ID = 'unit-test-key';
    process.env.R2_SECRET_ACCESS_KEY = 'unit-test-secret';
    assert.equal(requireR2Settings().config.region, 'auto');
    for (const key of keys) {
      const value = process.env[key];
      delete process.env[key];
      assert.throws(() => requireR2Settings(), new RegExp(key));
      process.env[key] = value;
    }
    for (const endpoint of [
      'http://example.com',
      'https://example.com',
      `https://${'a'.repeat(32)}.r2.cloudflarestorage.com/bucket`,
      `https://${'a'.repeat(32)}.r2.cloudflarestorage.com?token=unexpected`,
    ]) {
      process.env.R2_ENDPOINT = endpoint;
      assert.throws(() => requireR2Settings(), /R2_ENDPOINT/);
    }
  } finally {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});
