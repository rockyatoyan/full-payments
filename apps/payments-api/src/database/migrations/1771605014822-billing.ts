import { MigrationInterface, QueryRunner } from "typeorm";

export class Billing1771605014822 implements MigrationInterface {
    name = 'Billing1771605014822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "billingPeriod" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "billingPeriod"`);
    }

}
