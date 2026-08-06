import { MigrationInterface, QueryRunner } from 'typeorm';

export class CV1782138865383 implements MigrationInterface {
  name = 'CV1782138865383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_images" DROP CONSTRAINT "FK_events_images_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" DROP CONSTRAINT "FK_committee_members_committee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "committees" DROP CONSTRAINT "FK_committees_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "oauth_provider" TO "cv_file_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" ALTER COLUMN "year" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_images" ADD CONSTRAINT "FK_fbe0e902db77f8f6490f365d867" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" ADD CONSTRAINT "FK_7410db6ee097228a8f3b2035aa4" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "committees" ADD CONSTRAINT "FK_945c46d71a99b6d1b7a7f9c88c0" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "committees" DROP CONSTRAINT "FK_945c46d71a99b6d1b7a7f9c88c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" DROP CONSTRAINT "FK_7410db6ee097228a8f3b2035aa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_images" DROP CONSTRAINT "FK_fbe0e902db77f8f6490f365d867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" ALTER COLUMN "year" SET DEFAULT '2026'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "cv_file_key" TO "oauth_provider"`,
    );
    await queryRunner.query(
      `ALTER TABLE "committees" ADD CONSTRAINT "FK_committees_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "committee_members" ADD CONSTRAINT "FK_committee_members_committee" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_images" ADD CONSTRAINT "FK_events_images_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
