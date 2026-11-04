import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "novels" ADD COLUMN "published_at" timestamp(3) with time zone;
    ALTER TABLE "_novels_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
    ALTER TABLE "chapters" ADD COLUMN "published_at" timestamp(3) with time zone;
    ALTER TABLE "_chapters_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  `);
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "novels" DROP COLUMN "published_at";
    ALTER TABLE "_novels_v" DROP COLUMN "version_published_at";
    ALTER TABLE "chapters" DROP COLUMN "published_at";
    ALTER TABLE "_chapters_v" DROP COLUMN "version_published_at";
  `);
}
