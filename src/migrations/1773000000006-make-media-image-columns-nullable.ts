import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeMediaImageColumnsNullable1773000000006
  implements MigrationInterface
{
  name = 'MakeMediaImageColumnsNullable1773000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "awards" ALTER COLUMN "image_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "board" ALTER COLUMN "image_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" ALTER COLUMN "image_url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "committee_members" ALTER COLUMN "image_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "board" ALTER COLUMN "image_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" ALTER COLUMN "image_url" SET NOT NULL`,
    );
  }
}