import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventCategory1771785510411 implements MigrationInterface {
    name = 'AddEventCategory1771785510411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_category_enum" AS ENUM('Technical', 'Non-Technical', 'Social')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "category" "public"."events_category_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."events_category_enum"`);
    }

}
