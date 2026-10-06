import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import {
  S3Client,
  HeadBucketCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { requireR2Settings } from '../src/lib/r2-config.mjs';

const { bucket, config } = requireR2Settings();
const client = new S3Client(config);
try {
  if (process.argv[2] === 'check') {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.info('R2 存储桶连接检查通过。');
  } else if (process.argv[2] === 'backup') {
    const directory = process.argv[3];
    if (!directory || !path.isAbsolute(directory)) throw new Error('缺少 R2 备份绝对路径。');
    await mkdir(directory, { mode: 0o700 });
    const manifest = { bucket, createdAt: new Date().toISOString(), objects: [] };
    let continuation;
    do {
      const page = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          ContinuationToken: continuation,
        }),
      );
      for (const object of page.Contents ?? []) {
        if (!object.Key) throw new Error('R2 对象缺少 Key。');
        // 对象名不能直接作为本机路径，避免对象 key 穿越备份目录。
        const file = createHash('sha256').update(object.Key).digest('hex');
        const result = await client.send(
          new GetObjectCommand({
            Bucket: bucket,
            Key: object.Key,
            IfMatch: object.ETag,
          }),
        );
        if (!result.Body) throw new Error('R2 对象缺少文件内容。');
        await pipeline(
          result.Body,
          createWriteStream(path.join(directory, file), { flags: 'wx', mode: 0o600 }),
        );
        manifest.objects.push({
          key: object.Key,
          file,
          contentType: result.ContentType,
          metadata: result.Metadata,
          etag: result.ETag,
          size: result.ContentLength,
        });
      }
      continuation = page.NextContinuationToken;
      if (page.IsTruncated && !continuation) throw new Error('R2 分页缺少继续标识，停止备份。');
    } while (continuation);
    await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2), {
      flag: 'wx',
      mode: 0o600,
    });
    console.info(`R2 备份完成：${manifest.objects.length} 个对象。`);
  } else {
    throw new Error('未知 R2 操作，仅支持 check 或 backup。');
  }
} finally {
  client.destroy();
}
