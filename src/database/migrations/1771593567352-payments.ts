import { MigrationInterface, QueryRunner } from "typeorm";

export class Payments1771593567352 implements MigrationInterface {
    name = 'Payments1771593567352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "endDate" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
    }

}
