import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration17537987231753798723694 implements MigrationInterface {
    name = 'Migration17537987231753798723694'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
    }

}
