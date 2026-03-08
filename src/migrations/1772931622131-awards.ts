import { MigrationInterface, QueryRunner } from "typeorm";

export class Awards1772931622131 implements MigrationInterface {
    name = 'Awards1772931622131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "awards" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "avatar_url" character varying NOT NULL, "description" text NOT NULL, "color" character varying NOT NULL, "won_count" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bc3f6adc548ff46c76c03e06377" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "oauth_provider" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauth_provider"`);
        await queryRunner.query(`DROP TABLE "awards"`);
    }

}
