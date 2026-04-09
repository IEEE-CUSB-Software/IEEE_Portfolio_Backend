import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserAvatarToImage1773000000007
  implements MigrationInterface
{
  name = 'RenameUserAvatarToImage1773000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "avatar_url" TO "image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "avatar_public_id" TO "image_public_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "image_public_id" TO "avatar_public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "image_url" TO "avatar_url"`,
    );
  }
}
