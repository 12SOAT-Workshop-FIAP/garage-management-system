import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754782732297 implements MigrationInterface {
    name = 'Migration1754782732297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_order_services" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."work_order_services_status_enum"`);
        await queryRunner.query(`ALTER TABLE "work_order_services" ADD "status" character varying(20) NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_order_services" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."work_order_services_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "work_order_services" ADD "status" "public"."work_order_services_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

}
