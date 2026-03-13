import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommittees1771800000003 implements MigrationInterface {
  name = 'AddCommittees1771800000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "committees" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "about" text NOT NULL,
        "category_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_committees_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "committees" ADD CONSTRAINT "FK_committees_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "committees" DROP CONSTRAINT "FK_committees_category"`,
    );
    await queryRunner.query(`DROP TABLE "committees"`);
  }
}
