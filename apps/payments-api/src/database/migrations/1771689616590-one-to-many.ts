import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToMany1771689616590 implements MigrationInterface {
    name = 'OneToMany1771689616590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_53dc796e48a9488b45490af5ba7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "paymentsId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "paymentsId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_53dc796e48a9488b45490af5ba7" FOREIGN KEY ("paymentsId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
