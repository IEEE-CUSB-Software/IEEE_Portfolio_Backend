import { MigrationInterface, QueryRunner } from 'typeorm';

export class GithubId1769897362103 implements MigrationInterface {
  name = 'GithubId1769897362103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "github_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_09a2296ade1053a0cc4080bda4a" UNIQUE ("github_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_09a2296ade1053a0cc4080bda4a"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "github_id"`);
  }
}
