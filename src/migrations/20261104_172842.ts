import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_novels_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__novels_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__novels_v_published_locale" AS ENUM('en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru');
  CREATE TYPE "public"."enum_chapters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__chapters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__chapters_v_published_locale" AS ENUM('en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru');
  CREATE TABLE "novels" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "description" varchar,
    "cover_id" integer,
    "language" varchar DEFAULT 'zh-CN',
    "completed" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_novels_status" DEFAULT 'draft'
  );

  CREATE TABLE "_novels_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_description" varchar,
    "version_cover_id" integer,
    "version_language" varchar DEFAULT 'zh-CN',
    "version_completed" boolean DEFAULT false,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__novels_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__novels_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "chapters" (
    "id" serial PRIMARY KEY NOT NULL,
    "novel_id" integer,
    "slug" varchar,
    "title" varchar,
    "position" numeric,
    "markdown" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_chapters_status" DEFAULT 'draft'
  );

  CREATE TABLE "_chapters_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_novel_id" integer,
    "version_slug" varchar,
    "version_title" varchar,
    "version_position" numeric,
    "version_markdown" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__chapters_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__chapters_v_published_locale",
    "latest" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "novels_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "chapters_id" integer;
  ALTER TABLE "novels" ADD CONSTRAINT "novels_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novels_v" ADD CONSTRAINT "_novels_v_parent_id_novels_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novels_v" ADD CONSTRAINT "_novels_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chapters" ADD CONSTRAINT "chapters_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_chapters_v" ADD CONSTRAINT "_chapters_v_parent_id_chapters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chapters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_chapters_v" ADD CONSTRAINT "_chapters_v_version_novel_id_novels_id_fk" FOREIGN KEY ("version_novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "novels_slug_idx" ON "novels" USING btree ("slug");
  CREATE INDEX "novels_cover_idx" ON "novels" USING btree ("cover_id");
  CREATE INDEX "novels_updated_at_idx" ON "novels" USING btree ("updated_at");
  CREATE INDEX "novels_created_at_idx" ON "novels" USING btree ("created_at");
  CREATE INDEX "novels__status_idx" ON "novels" USING btree ("_status");
  CREATE INDEX "_novels_v_parent_idx" ON "_novels_v" USING btree ("parent_id");
  CREATE INDEX "_novels_v_version_version_slug_idx" ON "_novels_v" USING btree ("version_slug");
  CREATE INDEX "_novels_v_version_version_cover_idx" ON "_novels_v" USING btree ("version_cover_id");
  CREATE INDEX "_novels_v_version_version_updated_at_idx" ON "_novels_v" USING btree ("version_updated_at");
  CREATE INDEX "_novels_v_version_version_created_at_idx" ON "_novels_v" USING btree ("version_created_at");
  CREATE INDEX "_novels_v_version_version__status_idx" ON "_novels_v" USING btree ("version__status");
  CREATE INDEX "_novels_v_created_at_idx" ON "_novels_v" USING btree ("created_at");
  CREATE INDEX "_novels_v_updated_at_idx" ON "_novels_v" USING btree ("updated_at");
  CREATE INDEX "_novels_v_snapshot_idx" ON "_novels_v" USING btree ("snapshot");
  CREATE INDEX "_novels_v_published_locale_idx" ON "_novels_v" USING btree ("published_locale");
  CREATE INDEX "_novels_v_latest_idx" ON "_novels_v" USING btree ("latest");
  CREATE INDEX "chapters_novel_idx" ON "chapters" USING btree ("novel_id");
  CREATE INDEX "chapters_updated_at_idx" ON "chapters" USING btree ("updated_at");
  CREATE INDEX "chapters_created_at_idx" ON "chapters" USING btree ("created_at");
  CREATE INDEX "chapters__status_idx" ON "chapters" USING btree ("_status");
  CREATE UNIQUE INDEX "novel_slug_idx" ON "chapters" USING btree ("novel_id","slug");
  CREATE INDEX "_chapters_v_parent_idx" ON "_chapters_v" USING btree ("parent_id");
  CREATE INDEX "_chapters_v_version_version_novel_idx" ON "_chapters_v" USING btree ("version_novel_id");
  CREATE INDEX "_chapters_v_version_version_updated_at_idx" ON "_chapters_v" USING btree ("version_updated_at");
  CREATE INDEX "_chapters_v_version_version_created_at_idx" ON "_chapters_v" USING btree ("version_created_at");
  CREATE INDEX "_chapters_v_version_version__status_idx" ON "_chapters_v" USING btree ("version__status");
  CREATE INDEX "_chapters_v_created_at_idx" ON "_chapters_v" USING btree ("created_at");
  CREATE INDEX "_chapters_v_updated_at_idx" ON "_chapters_v" USING btree ("updated_at");
  CREATE INDEX "_chapters_v_snapshot_idx" ON "_chapters_v" USING btree ("snapshot");
  CREATE INDEX "_chapters_v_published_locale_idx" ON "_chapters_v" USING btree ("published_locale");
  CREATE INDEX "_chapters_v_latest_idx" ON "_chapters_v" USING btree ("latest");
  CREATE INDEX "version_novel_version_slug_idx" ON "_chapters_v" USING btree ("version_novel_id","version_slug");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novels_fk" FOREIGN KEY ("novels_id") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chapters_fk" FOREIGN KEY ("chapters_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_novels_id_idx" ON "payload_locked_documents_rels" USING btree ("novels_id");
  CREATE INDEX "payload_locked_documents_rels_chapters_id_idx" ON "payload_locked_documents_rels" USING btree ("chapters_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "novels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_novels_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chapters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_chapters_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "novels" CASCADE;
  DROP TABLE "_novels_v" CASCADE;
  DROP TABLE "chapters" CASCADE;
  DROP TABLE "_chapters_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novels_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_chapters_fk";

  DROP INDEX "payload_locked_documents_rels_novels_id_idx";
  DROP INDEX "payload_locked_documents_rels_chapters_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "novels_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "chapters_id";
  DROP TYPE "public"."enum_novels_status";
  DROP TYPE "public"."enum__novels_v_version_status";
  DROP TYPE "public"."enum__novels_v_published_locale";
  DROP TYPE "public"."enum_chapters_status";
  DROP TYPE "public"."enum__chapters_v_version_status";
  DROP TYPE "public"."enum__chapters_v_published_locale";`)
}
