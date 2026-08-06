import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOauthFields1769871966649 implements MigrationInterface {
  name = 'AddOauthFields1769871966649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "google_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "oauth_provider" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauth_provider"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
  }
}
