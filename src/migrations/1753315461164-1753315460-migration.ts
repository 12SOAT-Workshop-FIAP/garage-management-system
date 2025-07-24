import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753315461164 implements MigrationInterface {
  name = '1753315460Migration1753315461164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vehicles" ADD "name" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "name"`);
  }
}
