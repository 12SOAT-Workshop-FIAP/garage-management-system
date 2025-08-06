import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration17539183661753918366295 implements MigrationInterface {
    name = 'Migration17539183661753918366295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "customer_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "customer_id" integer NOT NULL`);
    }

}
