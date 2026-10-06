import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_collection_source" ADD VALUE 'research' BEFORE 'creations';
  ALTER TYPE "public"."enum__pages_v_blocks_collection_source" ADD VALUE 'research' BEFORE 'creations';
  ALTER TYPE "public"."enum_entries_kind" ADD VALUE 'research' BEFORE 'creations';
  ALTER TYPE "public"."enum__entries_v_version_kind" ADD VALUE 'research' BEFORE 'creations';
  UPDATE site_settings_navigation SET _order = _order + 1 WHERE _order >= 3
    AND NOT EXISTS (SELECT 1 FROM site_settings_navigation n WHERE n.href = '/research');
  INSERT INTO site_settings_navigation (_order, _parent_id, id, href)
    SELECT 3, s.id, md5('research-navigation-' || s.id::text), '/research' FROM site_settings s
    WHERE NOT EXISTS (SELECT 1 FROM site_settings_navigation n WHERE n._parent_id = s.id AND n.href = '/research');
  INSERT INTO site_settings_navigation_locales (label, _locale, _parent_id)
    SELECT CASE href WHEN '/' THEN '首页' WHEN '/projects' THEN '实践' WHEN '/research' THEN '求索' WHEN '/creations' THEN '创作' WHEN '/journal' THEN '行记' WHEN '/about' THEN '关于' END, 'zh-CN', id FROM site_settings_navigation
    WHERE href IN ('/', '/projects', '/research', '/creations', '/journal', '/about')
    ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label;
  UPDATE pages_blocks_hero SET title = '身份、价值观与经历'
    WHERE _locale = 'zh-CN' AND title = '做产品，
也做研究。' AND _parent_id IN (SELECT id FROM pages WHERE path = '/about');
  INSERT INTO site_settings_navigation_locales (label, _locale, _parent_id)
    SELECT CASE href WHEN '/' THEN '首頁' WHEN '/projects' THEN '實踐' WHEN '/research' THEN '求索' WHEN '/creations' THEN '創作' WHEN '/journal' THEN '行記' WHEN '/about' THEN '關於' END, 'zh-TW', id FROM site_settings_navigation
    WHERE href IN ('/', '/projects', '/research', '/creations', '/journal', '/about')
    ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label;
  UPDATE pages_blocks_hero SET title = '身分、價值觀與經歷'
    WHERE _locale = 'zh-TW' AND title = '做產品，
也做研究。' AND _parent_id IN (SELECT id FROM pages WHERE path = '/about');
  INSERT INTO site_settings_navigation_locales (label, _locale, _parent_id)
    SELECT CASE href WHEN '/' THEN 'Home' WHEN '/projects' THEN 'Practice' WHEN '/research' THEN 'Inquiry' WHEN '/creations' THEN 'Creations' WHEN '/journal' THEN 'Journal' WHEN '/about' THEN 'About' END, 'en', id FROM site_settings_navigation
    WHERE href IN ('/', '/projects', '/research', '/creations', '/journal', '/about')
    ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label;
  UPDATE pages_blocks_hero SET title = 'Identity, values and experience'
    WHERE _locale = 'en' AND title = 'Build products,
do research.' AND _parent_id IN (SELECT id FROM pages WHERE path = '/about');
  INSERT INTO site_settings_navigation_locales (label, _locale, _parent_id)
    SELECT CASE href WHEN '/' THEN 'ホーム' WHEN '/projects' THEN '実践' WHEN '/research' THEN '探究' WHEN '/creations' THEN '創作' WHEN '/journal' THEN '記録' WHEN '/about' THEN '紹介' END, 'ja', id FROM site_settings_navigation
    WHERE href IN ('/', '/projects', '/research', '/creations', '/journal', '/about')
    ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label;
  UPDATE pages_blocks_hero SET title = '人物、価値観、経験'
    WHERE _locale = 'ja' AND title = 'プロダクトを作り、
研究もする。' AND _parent_id IN (SELECT id FROM pages WHERE path = '/about');
`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_collection" ALTER COLUMN "source" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_collection_source";
  CREATE TYPE "public"."enum_pages_blocks_collection_source" AS ENUM('projects', 'creations', 'journal');
  ALTER TABLE "pages_blocks_collection" ALTER COLUMN "source" SET DATA TYPE "public"."enum_pages_blocks_collection_source" USING "source"::"public"."enum_pages_blocks_collection_source";
  ALTER TABLE "_pages_v_blocks_collection" ALTER COLUMN "source" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_collection_source";
  CREATE TYPE "public"."enum__pages_v_blocks_collection_source" AS ENUM('projects', 'creations', 'journal');
  ALTER TABLE "_pages_v_blocks_collection" ALTER COLUMN "source" SET DATA TYPE "public"."enum__pages_v_blocks_collection_source" USING "source"::"public"."enum__pages_v_blocks_collection_source";
  ALTER TABLE "entries" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_entries_kind";
  CREATE TYPE "public"."enum_entries_kind" AS ENUM('projects', 'creations', 'journal');
  ALTER TABLE "entries" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_entries_kind" USING "kind"::"public"."enum_entries_kind";
  ALTER TABLE "_entries_v" ALTER COLUMN "version_kind" SET DATA TYPE text;
  DROP TYPE "public"."enum__entries_v_version_kind";
  CREATE TYPE "public"."enum__entries_v_version_kind" AS ENUM('projects', 'creations', 'journal');
  ALTER TABLE "_entries_v" ALTER COLUMN "version_kind" SET DATA TYPE "public"."enum__entries_v_version_kind" USING "version_kind"::"public"."enum__entries_v_version_kind";`)
}
