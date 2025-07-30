import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePartsTable1753875063856 implements MigrationInterface {
    name = 'UpdatePartsTable1753875063856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_PARTS_PART_NUMBER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PARTS_CATEGORY"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PARTS_ACTIVE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PARTS_NAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PARTS_LOW_STOCK"`);
        await queryRunner.query(`CREATE TABLE "work_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_29f6c1884082ee6f535aed93660" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "licensePlate" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "parts" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "parts" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "services" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "active" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ALTER COLUMN "active" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "services" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "parts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "work_orders"`);
        await queryRunner.query(`CREATE INDEX "IDX_PARTS_LOW_STOCK" ON "parts" ("min_stock_level", "stock_quantity") `);
        await queryRunner.query(`CREATE INDEX "IDX_PARTS_NAME" ON "parts" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_PARTS_ACTIVE" ON "parts" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_PARTS_CATEGORY" ON "parts" ("category") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_PARTS_PART_NUMBER" ON "parts" ("part_number") WHERE (part_number IS NOT NULL)`);
    }

}
