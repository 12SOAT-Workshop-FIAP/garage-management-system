import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateVehiclesTable1754490000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create vehicles table
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'plate',
            type: 'varchar',
            length: '8',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'customerId',
            type: 'int',
            isNullable: false,
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
      }),
      true,
    );

    // Create foreign key to customers table
    await queryRunner.createForeignKey(
      'vehicles',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create index on license plate for fast lookups
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_VEHICLE_PLATE',
        columnNames: ['plate'],
        isUnique: true,
      }),
    );

    // Create index on customer ID for fast lookups
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_VEHICLE_CUSTOMER',
        columnNames: ['customerId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('vehicles', 'IDX_VEHICLE_CUSTOMER');
    await queryRunner.dropIndex('vehicles', 'IDX_VEHICLE_PLATE');
    
    // Drop foreign keys
    const table = await queryRunner.getTable('vehicles');
    const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('customerId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('vehicles', foreignKey);
    }
    
    // Drop table
    await queryRunner.dropTable('vehicles');
  }
}
