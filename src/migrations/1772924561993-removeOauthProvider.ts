import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOauthProvider1772924561993 implements MigrationInterface {
    name = 'RemoveOauthProvider1772924561993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauth_provider"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "oauth_provider" character varying`);
    }

}
