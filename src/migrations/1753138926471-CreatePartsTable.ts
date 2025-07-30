import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePartsTable1753138926471 implements MigrationInterface {
  name = 'CreatePartsTable1753138926471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'part_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'cost_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'stock_quantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'min_stock_level',
            type: 'int',
            default: 1,
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20',
            default: "'piece'",
          },
          {
            name: 'supplier',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_PARTS_PART_NUMBER',
            columnNames: ['part_number'],
            isUnique: true,
            where: 'part_number IS NOT NULL',
          },
          {
            name: 'IDX_PARTS_CATEGORY',
            columnNames: ['category'],
          },
          {
            name: 'IDX_PARTS_ACTIVE',
            columnNames: ['active'],
          },
          {
            name: 'IDX_PARTS_NAME',
            columnNames: ['name'],
          },
          {
            name: 'IDX_PARTS_LOW_STOCK',
            columnNames: ['stock_quantity', 'min_stock_level'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parts');
  }
}
