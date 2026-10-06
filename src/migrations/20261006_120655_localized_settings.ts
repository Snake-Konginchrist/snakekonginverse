import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_socials_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"description" varchar DEFAULT '独立开发者彩旗飘飘的产品、研究与个人记录。' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "brand" SET DEFAULT 'SnakeKonginverse';
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_locales" ADD CONSTRAINT "site_settings_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials_locales" ADD CONSTRAINT "site_settings_socials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_navigation_locales_locale_parent_id_unique" ON "site_settings_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_socials_locales_locale_parent_id_unique" ON "site_settings_socials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT "alt", 'zh-CN', "id" FROM "media";
  INSERT INTO "site_settings_navigation_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'zh-CN', "id" FROM "site_settings_navigation";
  INSERT INTO "site_settings_socials_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'zh-CN', "id" FROM "site_settings_socials";
  INSERT INTO "site_settings_locales" ("description", "_locale", "_parent_id")
    SELECT "description", 'zh-CN', "id" FROM "site_settings";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "site_settings_navigation" DROP COLUMN "label";
  ALTER TABLE "site_settings_socials" DROP COLUMN "label";
  ALTER TABLE "site_settings" DROP COLUMN "description";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN "alt" varchar;
    ALTER TABLE "site_settings_navigation" ADD COLUMN "label" varchar;
    ALTER TABLE "site_settings_socials" ADD COLUMN "label" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "description" varchar;
    UPDATE "media" p SET "alt" = l."alt" FROM "media_locales" l
      WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
    UPDATE "site_settings_navigation" p SET "label" = l."label" FROM "site_settings_navigation_locales" l
      WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
    UPDATE "site_settings_socials" p SET "label" = l."label" FROM "site_settings_socials_locales" l
      WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
    UPDATE "site_settings" p SET "description" = l."description" FROM "site_settings_locales" l
      WHERE l."_parent_id" = p."id" AND l."_locale" = 'zh-CN';
    ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
    ALTER TABLE "site_settings_navigation" ALTER COLUMN "label" SET NOT NULL;
    ALTER TABLE "site_settings_socials" ALTER COLUMN "label" SET NOT NULL;
    ALTER TABLE "site_settings" ALTER COLUMN "description" SET NOT NULL;
    ALTER TABLE "site_settings" ALTER COLUMN "description" SET DEFAULT '代码、故事，以及想象力的另一面。';
    ALTER TABLE "site_settings" ALTER COLUMN "brand" SET DEFAULT 'SnakeKonginVerse';
    DROP TABLE "media_locales", "site_settings_navigation_locales", "site_settings_socials_locales", "site_settings_locales";
  `);
}
