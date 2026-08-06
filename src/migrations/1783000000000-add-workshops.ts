import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkshops1783000000000 implements MigrationInterface {
  name = 'AddWorkshops1783000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create instructors table
    await queryRunner.query(
      `CREATE TABLE "instructors" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "bio" text,
        "image_url" character varying,
        "image_public_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_instructors_id" PRIMARY KEY ("id")
      )`,
    );

    // 2. Create workshops table
    await queryRunner.query(
      `CREATE TABLE "workshops" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "content" text NOT NULL,
        "image_url" character varying,
        "image_public_id" character varying,
        "location" character varying NOT NULL,
        "start_time" TIMESTAMP NOT NULL,
        "end_time" TIMESTAMP NOT NULL,
        "capacity" integer NOT NULL,
        "registration_deadline" TIMESTAMP NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workshops_id" PRIMARY KEY ("id")
      )`,
    );

    // 3. Create enum type for workshop registrations status
    await queryRunner.query(
      `CREATE TYPE "public"."workshop_registrations_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'cancelled', 'attended')`,
    );

    // 4. Create workshop_registrations table
    await queryRunner.query(
      `CREATE TABLE "workshop_registrations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "workshop_id" uuid NOT NULL,
        "status" "public"."workshop_registrations_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workshop_registrations_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_workshop_registration_unique" UNIQUE ("workshop_id", "user_id")
      )`,
    );

    // 5. Create workshops_images table
    await queryRunner.query(
      `CREATE TABLE "workshops_images" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "workshop_id" uuid NOT NULL,
        "image_url" character varying NOT NULL,
        "image_public_id" character varying,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workshops_images_id" PRIMARY KEY ("id")
      )`,
    );

    // 6. Create workshops_instructors_join junction table
    await queryRunner.query(
      `CREATE TABLE "workshops_instructors_join" (
        "workshop_id" uuid NOT NULL,
        "instructor_id" uuid NOT NULL,
        CONSTRAINT "PK_workshops_instructors_join" PRIMARY KEY ("workshop_id", "instructor_id")
      )`,
    );

    // 7. Add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "workshops" ADD CONSTRAINT "FK_workshops_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshop_registrations" ADD CONSTRAINT "FK_workshop_registrations_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshop_registrations" ADD CONSTRAINT "FK_workshop_registrations_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops_images" ADD CONSTRAINT "FK_workshops_images_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops_instructors_join" ADD CONSTRAINT "FK_workshops_instructors_join_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops_instructors_join" ADD CONSTRAINT "FK_workshops_instructors_join_instructor" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "workshops_instructors_join" DROP CONSTRAINT "FK_workshops_instructors_join_instructor"`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops_instructors_join" DROP CONSTRAINT "FK_workshops_instructors_join_workshop"`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops_images" DROP CONSTRAINT "FK_workshops_images_workshop"`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshop_registrations" DROP CONSTRAINT "FK_workshop_registrations_workshop"`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshop_registrations" DROP CONSTRAINT "FK_workshop_registrations_user"`,
    );

    await queryRunner.query(
      `ALTER TABLE "workshops" DROP CONSTRAINT "FK_workshops_created_by"`,
    );

    // 2. Drop tables
    await queryRunner.query(`DROP TABLE "workshops_instructors_join"`);
    await queryRunner.query(`DROP TABLE "workshops_images"`);
    await queryRunner.query(`DROP TABLE "workshop_registrations"`);
    await queryRunner.query(
      `DROP TYPE "public"."workshop_registrations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "workshops"`);
    await queryRunner.query(`DROP TABLE "instructors"`);
  }
}
