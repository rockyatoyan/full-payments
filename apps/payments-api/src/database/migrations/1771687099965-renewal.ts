import { MigrationInterface, QueryRunner } from "typeorm";

export class Renewal1771687099965 implements MigrationInterface {
    name = 'Renewal1771687099965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAllowedAutoRenewal" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAllowedAutoRenewal"`);
    }

}
