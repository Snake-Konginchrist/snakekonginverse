import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('zh-CN', 'zh-TW', 'en', 'ja');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('zh-CN', 'zh-TW', 'en', 'ja');
  CREATE TYPE "public"."enum__entries_v_published_locale" AS ENUM('zh-CN', 'zh-TW', 'en', 'ja');
  CREATE TABLE "pages_locales" (
    "title" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v_locales" (
    "version_title" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "entries_locales" (
    "title" varchar,
    "summary" varchar,
    "content" jsonb,
    "seo_title" varchar,
    "seo_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_entries_v_locales" (
    "version_title" varchar,
    "version_summary" varchar,
    "version_content" jsonb,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  ALTER TABLE "pages_blocks_hero" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "pages_blocks_portals" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "pages_blocks_portals" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "pages_blocks_collection" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "pages_blocks_collection" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "pages_blocks_text" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "pages_blocks_statement" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "pages_blocks_statement" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_portals" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_pages_v_blocks_portals" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_collection" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_pages_v_blocks_collection" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_text" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_pages_v_blocks_text" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_statement" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_pages_v_blocks_statement" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "entries_tags" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "entries_tags" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_entries_v_version_tags" ADD COLUMN "_locale" "_locales" DEFAULT 'zh-CN' NOT NULL;
  ALTER TABLE "_entries_v_version_tags" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "_entries_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_entries_v" ADD COLUMN "published_locale" "enum__entries_v_published_locale";
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entries_locales" ADD CONSTRAINT "entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_entries_v_locales" ADD CONSTRAINT "_entries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "entries_locales_locale_parent_id_unique" ON "entries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_entries_v_locales_locale_parent_id_unique" ON "_entries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_portals_locale_idx" ON "pages_blocks_portals" USING btree ("_locale");
  CREATE INDEX "pages_blocks_collection_locale_idx" ON "pages_blocks_collection" USING btree ("_locale");
  CREATE INDEX "pages_blocks_text_locale_idx" ON "pages_blocks_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_statement_locale_idx" ON "pages_blocks_statement" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_locale_idx" ON "_pages_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_portals_locale_idx" ON "_pages_v_blocks_portals" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_collection_locale_idx" ON "_pages_v_blocks_collection" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_text_locale_idx" ON "_pages_v_blocks_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_statement_locale_idx" ON "_pages_v_blocks_statement" USING btree ("_locale");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "entries_tags_locale_idx" ON "entries_tags" USING btree ("_locale");
  CREATE INDEX "_entries_v_version_tags_locale_idx" ON "_entries_v_version_tags" USING btree ("_locale");
  CREATE INDEX "_entries_v_snapshot_idx" ON "_entries_v" USING btree ("snapshot");
  CREATE INDEX "_entries_v_published_locale_idx" ON "_entries_v" USING btree ("published_locale");
  -- 在删除旧列之前搬运内容；旧页面、文章和历史版本都属于默认语言。
  INSERT INTO "pages_locales" ("_parent_id", "_locale", "title", "seo_title", "seo_description")
    SELECT "id", 'zh-CN', "title", "seo_title", "seo_description" FROM "pages";
  INSERT INTO "_pages_v_locales" ("_parent_id", "_locale", "version_title", "version_seo_title", "version_seo_description")
    SELECT "id", 'zh-CN', "version_title", "version_seo_title", "version_seo_description" FROM "_pages_v";
  INSERT INTO "entries_locales" ("_parent_id", "_locale", "title", "summary", "content", "seo_title", "seo_description")
    SELECT "id", 'zh-CN', "title", "summary", "content", "seo_title", "seo_description" FROM "entries";
  INSERT INTO "_entries_v_locales" ("_parent_id", "_locale", "version_title", "version_summary", "version_content", "version_seo_title", "version_seo_description")
    SELECT "id", 'zh-CN', "version_title", "version_summary", "version_content", "version_seo_title", "version_seo_description" FROM "_entries_v";
  UPDATE "_pages_v" SET "published_locale" = 'zh-CN' WHERE "version__status" = 'published';
  UPDATE "_entries_v" SET "published_locale" = 'zh-CN' WHERE "version__status" = 'published';
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "seo_title";
  ALTER TABLE "pages" DROP COLUMN "seo_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "entries" DROP COLUMN "title";
  ALTER TABLE "entries" DROP COLUMN "summary";
  ALTER TABLE "entries" DROP COLUMN "content";
  ALTER TABLE "entries" DROP COLUMN "seo_title";
  ALTER TABLE "entries" DROP COLUMN "seo_description";
  ALTER TABLE "_entries_v" DROP COLUMN "version_title";
  ALTER TABLE "_entries_v" DROP COLUMN "version_summary";
  ALTER TABLE "_entries_v" DROP COLUMN "version_content";
  ALTER TABLE "_entries_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_entries_v" DROP COLUMN "version_seo_description";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM "pages_locales" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_locales" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "entries_locales" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_entries_v_locales" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "entries_tags" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_entries_v_version_tags" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "pages_blocks_hero" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "pages_blocks_portals" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "pages_blocks_collection" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "pages_blocks_text" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "pages_blocks_statement" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_blocks_hero" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_blocks_portals" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_blocks_collection" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_blocks_text" WHERE "_locale" <> 'zh-CN') OR
       EXISTS (SELECT 1 FROM "_pages_v_blocks_statement" WHERE "_locale" <> 'zh-CN') THEN
      RAISE EXCEPTION 'Cannot roll back localization while translated content exists. Restore a backup instead.';
    END IF;
  END $$;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "entries" ADD COLUMN "title" varchar;
  ALTER TABLE "entries" ADD COLUMN "summary" varchar;
  ALTER TABLE "entries" ADD COLUMN "content" jsonb;
  ALTER TABLE "entries" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "entries" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_entries_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_entries_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_entries_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_entries_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_entries_v" ADD COLUMN "version_seo_description" varchar;
  UPDATE "pages" p SET "title" = l."title", "seo_title" = l."seo_title", "seo_description" = l."seo_description"
    FROM "pages_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
  UPDATE "_pages_v" p SET "version_title" = l."version_title", "version_seo_title" = l."version_seo_title", "version_seo_description" = l."version_seo_description"
    FROM "_pages_v_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
  UPDATE "entries" e SET "title" = l."title", "summary" = l."summary", "content" = l."content", "seo_title" = l."seo_title", "seo_description" = l."seo_description"
    FROM "entries_locales" l WHERE l."_parent_id" = e."id" AND l."_locale" = 'zh-CN';
  UPDATE "_entries_v" e SET "version_title" = l."version_title", "version_summary" = l."version_summary", "version_content" = l."version_content", "version_seo_title" = l."version_seo_title", "version_seo_description" = l."version_seo_description"
    FROM "_entries_v_locales" l WHERE l."_parent_id" = e."id" AND l."_locale" = 'zh-CN';
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "entries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_entries_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "entries_locales" CASCADE;
  DROP TABLE "_entries_v_locales" CASCADE;
  DROP INDEX "pages_blocks_hero_locale_idx";
  DROP INDEX "pages_blocks_portals_locale_idx";
  DROP INDEX "pages_blocks_collection_locale_idx";
  DROP INDEX "pages_blocks_text_locale_idx";
  DROP INDEX "pages_blocks_statement_locale_idx";
  DROP INDEX "_pages_v_blocks_hero_locale_idx";
  DROP INDEX "_pages_v_blocks_portals_locale_idx";
  DROP INDEX "_pages_v_blocks_collection_locale_idx";
  DROP INDEX "_pages_v_blocks_text_locale_idx";
  DROP INDEX "_pages_v_blocks_statement_locale_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "entries_tags_locale_idx";
  DROP INDEX "_entries_v_version_tags_locale_idx";
  DROP INDEX "_entries_v_snapshot_idx";
  DROP INDEX "_entries_v_published_locale_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_portals" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_collection" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_statement" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_portals" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_collection" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_text" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_statement" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "entries_tags" DROP COLUMN "_locale";
  ALTER TABLE "_entries_v_version_tags" DROP COLUMN "_locale";
  ALTER TABLE "_entries_v" DROP COLUMN "snapshot";
  ALTER TABLE "_entries_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__entries_v_published_locale";`)
}
