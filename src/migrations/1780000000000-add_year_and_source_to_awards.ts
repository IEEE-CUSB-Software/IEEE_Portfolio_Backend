import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYearAndSourceToAwards1780000000000 implements MigrationInterface {
  name = 'AddYearAndSourceToAwards1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "awards" ADD "year" integer NOT NULL DEFAULT ${new Date().getFullYear()}`,
    );
    await queryRunner.query(
      `CREATE TYPE "awards_source_enum" AS ENUM('GLOBAL', 'EGYPT_SECTION', 'REGION_8')`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" ADD "source" "awards_source_enum" NOT NULL DEFAULT 'GLOBAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "awards" DROP COLUMN "source"`,
    );
    await queryRunner.query(
      `DROP TYPE "awards_source_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" DROP COLUMN "year"`,
    );
  }
}
