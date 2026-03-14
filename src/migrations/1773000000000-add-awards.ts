import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAwards1773000000000 implements MigrationInterface {
  name = 'AddAwards1773000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasAwardsTable = await queryRunner.hasTable('awards');

    if (!hasAwardsTable) {
      await queryRunner.query(
        `CREATE TABLE "awards" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
          "image_url" character varying NOT NULL,
          "title" character varying NOT NULL,
          "description" text NOT NULL,
          "won_count" integer NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_awards_id" PRIMARY KEY ("id")
        )`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasAwardsTable = await queryRunner.hasTable('awards');

    if (hasAwardsTable) {
      await queryRunner.query(`DROP TABLE "awards"`);
    }
  }
}
