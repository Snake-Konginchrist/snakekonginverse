import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

const addedLocales = ['ko', 'es', 'fr', 'de', 'pt', 'ru'] as const;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const locale of addedLocales) {
    await db.execute(sql.raw(`ALTER TYPE "public"."_locales" ADD VALUE IF NOT EXISTS '${locale}'`));
    await db.execute(
      sql.raw(
        `ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE IF NOT EXISTS '${locale}'`,
      ),
    );
    await db.execute(
      sql.raw(
        `ALTER TYPE "public"."enum__entries_v_published_locale" ADD VALUE IF NOT EXISTS '${locale}'`,
      ),
    );
  }
}

/** PostgreSQL enum values cannot be removed safely once localized content may use them. */
export async function down(_args: MigrateDownArgs): Promise<void> {
  // PostgreSQL cannot safely remove enum labels after localized records may reference them.
  void _args;
}
