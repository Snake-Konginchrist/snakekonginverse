import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "novel_view_totals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"target" varchar NOT NULL,
  	"views" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "novel_view_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "novel_view_totals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "novel_view_visits_id" integer;
  CREATE UNIQUE INDEX "novel_view_totals_target_idx" ON "novel_view_totals" USING btree ("target");
  CREATE INDEX "novel_view_totals_updated_at_idx" ON "novel_view_totals" USING btree ("updated_at");
  CREATE INDEX "novel_view_totals_created_at_idx" ON "novel_view_totals" USING btree ("created_at");
  CREATE UNIQUE INDEX "novel_view_visits_key_idx" ON "novel_view_visits" USING btree ("key");
  CREATE INDEX "novel_view_visits_updated_at_idx" ON "novel_view_visits" USING btree ("updated_at");
  CREATE INDEX "novel_view_visits_created_at_idx" ON "novel_view_visits" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novel_view_totals_fk" FOREIGN KEY ("novel_view_totals_id") REFERENCES "public"."novel_view_totals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novel_view_visits_fk" FOREIGN KEY ("novel_view_visits_id") REFERENCES "public"."novel_view_visits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_novel_view_totals_id_idx" ON "payload_locked_documents_rels" USING btree ("novel_view_totals_id");
  CREATE INDEX "payload_locked_documents_rels_novel_view_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("novel_view_visits_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
 await db.execute(sql`
 ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "novel_view_totals_id";
 ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "novel_view_visits_id";
 DROP TABLE "novel_view_visits";
 DROP TABLE "novel_view_totals";
 `);
}
