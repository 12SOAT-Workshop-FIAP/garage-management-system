import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760346916838 implements MigrationInterface {
    name = 'Migration1760346916838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "person_type" text NOT NULL, "document" character varying NOT NULL, "email" character varying, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6" UNIQUE ("document"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "brand" character varying(50) NOT NULL, "model" character varying(50) NOT NULL, "plate" character varying NOT NULL, "year" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "customerId" integer, CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE ("plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "active" boolean NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_order_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workOrderId" uuid NOT NULL, "serviceId" uuid NOT NULL, "serviceName" character varying(255) NOT NULL, "serviceDescription" text NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "estimatedDuration" integer NOT NULL, "actualDuration" integer, "estimatedCost" numeric(10,2), "actualCost" numeric(10,2), "status" character varying(20) NOT NULL DEFAULT 'PENDING', "startedAt" TIMESTAMP, "completedAt" TIMESTAMP, "technicianNotes" text, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_67cc6db8cc36862baf74fbfa2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "partNumber" character varying NOT NULL, "category" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "costPrice" numeric(10,2) NOT NULL, "stockQuantity" integer NOT NULL, "minStockLevel" integer NOT NULL, "unit" character varying NOT NULL, "supplier" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97e856fb0a6f35ee34d5e9c070c" UNIQUE ("partNumber"), CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_order_parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workOrderId" uuid NOT NULL, "partId" uuid NOT NULL, "partName" character varying(255) NOT NULL, "partDescription" text NOT NULL, "partNumber" character varying(100) NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "notes" text, "isApproved" boolean NOT NULL DEFAULT false, "appliedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f940468276c041deed13cd240cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" integer NOT NULL, "vehicleId" integer NOT NULL, "description" text NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "estimatedCost" numeric(10,2) NOT NULL DEFAULT '0', "actualCost" numeric(10,2), "laborCost" numeric(10,2), "partsCost" numeric(10,2), "diagnosis" text, "technicianNotes" text, "customerApproval" boolean NOT NULL DEFAULT false, "assignedTechnicianId" uuid, "estimatedCompletionDate" TIMESTAMP, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_29f6c1884082ee6f535aed93660" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_ddb00709ac9788b3ded9296f2a8" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_services" ADD CONSTRAINT "FK_02f4a85d8525089754871580a8c" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_7474a45e754d03b193f1dc8dc54" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" ADD CONSTRAINT "FK_e8cf7d08c671baff977ccc13a67" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_7cb4454b9e9479b92e035f26056" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD CONSTRAINT "FK_223d6e27c7bca6e95d598e84bf1" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_223d6e27c7bca6e95d598e84bf1"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP CONSTRAINT "FK_7cb4454b9e9479b92e035f26056"`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_e8cf7d08c671baff977ccc13a67"`);
        await queryRunner.query(`ALTER TABLE "work_order_parts" DROP CONSTRAINT "FK_7474a45e754d03b193f1dc8dc54"`);
        await queryRunner.query(`ALTER TABLE "work_order_services" DROP CONSTRAINT "FK_02f4a85d8525089754871580a8c"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_ddb00709ac9788b3ded9296f2a8"`);
        await queryRunner.query(`DROP TABLE "work_orders"`);
        await queryRunner.query(`DROP TABLE "work_order_parts"`);
        await queryRunner.query(`DROP TABLE "parts"`);
        await queryRunner.query(`DROP TABLE "work_order_services"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
