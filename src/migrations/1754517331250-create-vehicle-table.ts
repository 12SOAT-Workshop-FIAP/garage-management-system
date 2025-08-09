import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicleTable1754517331250 implements MigrationInterface {
    name = 'CreateVehicleTable1754517331250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627"`);
        await queryRunner.query(`ALTER TABLE "vehicles" RENAME COLUMN "customer_id" TO "customerId"`);
        await queryRunner.query(`CREATE TYPE "public"."customers_person_type_enum" AS ENUM('INDIVIDUAL', 'COMPANY')`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "person_type" "public"."customers_person_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "document" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6" UNIQUE ("document")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_ddb00709ac9788b3ded9296f2a8" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_ddb00709ac9788b3ded9296f2a8"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "customerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "person_type"`);
        await queryRunner.query(`DROP TYPE "public"."customers_person_type_enum"`);
        await queryRunner.query(`ALTER TABLE "vehicles" RENAME COLUMN "customerId" TO "customer_id"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c1cda98f67cb9c79a1f1153e627" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
