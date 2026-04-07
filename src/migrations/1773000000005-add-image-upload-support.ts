import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageUploadSupport1773000000005 implements MigrationInterface {
  name = 'AddImageUploadSupport1773000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "awards" ADD "image_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "board" ADD "image_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" ADD "image_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar_public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "image_public_id" character varying`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_images" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "event_id" uuid NOT NULL, "image_url" character varying NOT NULL, "image_public_id" character varying, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_events_images_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_images" ADD CONSTRAINT "FK_events_images_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_images" DROP CONSTRAINT "FK_events_images_event_id"`,
    );
    await queryRunner.query(`DROP TABLE "events_images"`);
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN "image_public_id"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "image_url"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "avatar_public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" DROP COLUMN "image_public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "board" DROP COLUMN "image_public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" DROP COLUMN "image_public_id"`,
    );
  }
}
