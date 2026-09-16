import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVacancyImageAndCategory1783500000000
  implements MigrationInterface
{
  name = 'AddVacancyImageAndCategory1783500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vacancies_category_enum" AS ENUM('Technical', 'Marketing', 'Media', 'HR', 'Finance', 'Event Planning', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD "image_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD "category" "public"."vacancies_category_enum" DEFAULT 'Other'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "vacancies" DROP COLUMN "image_public_id"`,
    );
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "image_url"`);
    await queryRunner.query(
      `DROP TYPE "public"."vacancies_category_enum"`,
    );
  }
}
