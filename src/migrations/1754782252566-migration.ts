import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754782252566 implements MigrationInterface {
    name = 'Migration1754782252566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "work_order_parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workOrderId" uuid NOT NULL, "partId" uuid NOT NULL, "partName" character varying(255) NOT NULL, "partDescription" text NOT NULL, "partNumber" character varying(100) NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "notes" text, "isApproved" boolean NOT NULL DEFAULT false, "appliedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f940468276c041deed13cd240cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_7474a45e754d03b193f1dc8dc54" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_7474a45e754d03b193f1dc8dc54"`);
        await queryRunner.query(`DROP TABLE "work_order_parts"`);
    }

}
