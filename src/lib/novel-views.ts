import { sql } from '@payloadcms/db-postgres';
import type { Payload } from 'payload';
import { visitKey } from './novel-view-identity';

export async function viewCounts(payload: Payload, targets: string[]) {
  if (!targets.length) return {} as Record<string, number>;
  const values = sql.join(
    targets.map((target) => sql`${target}`),
    sql`, `,
  );
  const result = await payload.db.drizzle.execute(
    sql`SELECT target, views FROM novel_view_totals WHERE target IN (${values})`,
  );
  return Object.fromEntries(result.rows.map((row) => [String(row.target), Number(row.views)]));
}
export async function recordView(payload: Payload, visitor: string, targets: string[]) {
  for (const target of targets) {
    const key = visitKey(visitor, target);
    // 唯一键和累加在同一 SQL 语句内完成，刷新、并发请求不会重复计数。
    await payload.db.drizzle.execute(sql`
      WITH inserted AS (
        INSERT INTO novel_view_visits (key, created_at, updated_at)
        VALUES (${key}, now(), now()) ON CONFLICT (key) DO NOTHING RETURNING id
      )
      INSERT INTO novel_view_totals (target, views, created_at, updated_at)
      SELECT ${target}, 1, now(), now() FROM inserted
      ON CONFLICT (target) DO UPDATE SET views = novel_view_totals.views + 1, updated_at = now()
    `);
  }
  await payload.db.drizzle.execute(
    sql`DELETE FROM novel_view_visits WHERE created_at < now() - interval '2 days'`,
  );
  return viewCounts(payload, targets);
}
