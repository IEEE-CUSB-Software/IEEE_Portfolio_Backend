import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhoneOptional1770659900148 implements MigrationInterface {
  name = 'PhoneOptional1770659900148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_event_registrations_event"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_events_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_e42ba7c85b05c49c8de4f360543" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_1a259861a2ce114f074b366eed2" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_1a259861a2ce114f074b366eed2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_e42ba7c85b05c49c8de4f360543"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_events_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registrations" ADD CONSTRAINT "FK_event_registrations_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
