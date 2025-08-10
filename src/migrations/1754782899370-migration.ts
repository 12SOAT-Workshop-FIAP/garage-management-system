import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754782899370 implements MigrationInterface {
    name = 'Migration1754782899370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "customerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "vehicleId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."work_orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "status" character varying(20) NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_7cb4454b9e9479b92e035f26056" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_223d6e27c7bca6e95d598e84bf1" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_e8cf7d08c671baff977ccc13a67" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_e8cf7d08c671baff977ccc13a67"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_223d6e27c7bca6e95d598e84bf1"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_7cb4454b9e9479b92e035f26056"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."work_orders_status_enum" AS ENUM('pending', 'approved', 'in_progress', 'waiting_parts', 'waiting_customer', 'completed', 'cancelled', 'delivered')`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "status" "public"."work_orders_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "vehicleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "customerId" uuid NOT NULL`);
    }

}
