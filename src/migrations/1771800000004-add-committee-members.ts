import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommitteeMembers1771800000004 implements MigrationInterface {
  name = 'AddCommitteeMembers1771800000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."committee_members_role_enum" AS ENUM('head', 'vice_head', 'member')`,
    );

    await queryRunner.query(
      `CREATE TABLE "committee_members" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "committee_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "role" "public"."committee_members_role_enum" NOT NULL,
        "image_url" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_committee_members_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "committee_members" ADD CONSTRAINT "FK_committee_members_committee" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "committee_members" DROP CONSTRAINT "FK_committee_members_committee"`,
    );
    await queryRunner.query(`DROP TABLE "committee_members"`);
    await queryRunner.query(
      `DROP TYPE "public"."committee_members_role_enum"`,
    );
  }
}
