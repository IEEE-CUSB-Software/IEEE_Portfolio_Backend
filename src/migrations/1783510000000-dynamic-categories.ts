import { MigrationInterface, QueryRunner } from 'typeorm';

export class DynamicCategories1783510000000 implements MigrationInterface {
  name = 'DynamicCategories1783510000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add type to categories
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('COMMITTEE', 'EVENT', 'WORKSHOP', 'RECRUITMENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "type" "public"."categories_type_enum" NOT NULL DEFAULT 'COMMITTEE'`
    );

    // Drop old unique constraint on name and add new unique on (name, type)
    await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_categories_name_type" UNIQUE ("name", "type")`);

    // 2. Add category_id to events, workshops, vacancies
    await queryRunner.query(`ALTER TABLE "events" ADD "category_id" uuid`);
    await queryRunner.query(`ALTER TABLE "workshops" ADD "category_id" uuid`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD "category_id" uuid`);

    // 3. Migrate Events data
    const events = await queryRunner.query(`SELECT DISTINCT category FROM "events" WHERE category IS NOT NULL`);
    for (const row of events) {
      if (!row.category) continue;
      // Insert if not exists
      const catRes = await queryRunner.query(
        `INSERT INTO "categories" (name, type) VALUES ($1, 'EVENT') ON CONFLICT ("name", "type") DO UPDATE SET "name"=EXCLUDED.name RETURNING id`,
        [row.category]
      );
      const catId = catRes[0].id;
      // Update events
      await queryRunner.query(`UPDATE "events" SET "category_id" = $1 WHERE "category" = $2`, [catId, row.category]);
    }

    // 4. Migrate Vacancies data
    const vacancies = await queryRunner.query(`SELECT DISTINCT category FROM "vacancies" WHERE category IS NOT NULL`);
    for (const row of vacancies) {
      if (!row.category) continue;
      const catRes = await queryRunner.query(
        `INSERT INTO "categories" (name, type) VALUES ($1, 'RECRUITMENT') ON CONFLICT ("name", "type") DO UPDATE SET "name"=EXCLUDED.name RETURNING id`,
        [row.category]
      );
      const catId = catRes[0].id;
      await queryRunner.query(`UPDATE "vacancies" SET "category_id" = $1 WHERE "category" = $2`, [catId, row.category]);
    }

    // 5. Drop old enum columns
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."events_category_enum"`);
    
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."vacancies_category_enum"`);

    // 6. Add Foreign Keys
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_events_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshops" ADD CONSTRAINT "FK_workshops_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD CONSTRAINT "FK_vacancies_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert Foreign Keys
    await queryRunner.query(`ALTER TABLE "vacancies" DROP CONSTRAINT "FK_vacancies_category"`);
    await queryRunner.query(`ALTER TABLE "workshops" DROP CONSTRAINT "FK_workshops_category"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_category"`);

    // Revert enum columns
    await queryRunner.query(`CREATE TYPE "public"."events_category_enum" AS ENUM('Technical', 'Non-Technical', 'Social')`);
    await queryRunner.query(`ALTER TABLE "events" ADD "category" "public"."events_category_enum" NOT NULL DEFAULT 'Technical'`);
    
    await queryRunner.query(`CREATE TYPE "public"."vacancies_category_enum" AS ENUM('Technical', 'Marketing', 'Media', 'HR', 'Finance', 'Event Planning', 'Other')`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD "category" "public"."vacancies_category_enum" DEFAULT 'Other'`);

    // Revert schema changes
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "workshops" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category_id"`);

    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_categories_name_type"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
  }
}
