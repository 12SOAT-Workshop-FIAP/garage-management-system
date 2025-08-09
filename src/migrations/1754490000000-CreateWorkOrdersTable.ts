import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWorkOrdersTable1754490000000 implements MigrationInterface {
  name = 'CreateWorkOrdersTable1754490000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'work_orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customerId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'vehicleId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'approved', 'in_progress', 'waiting_parts', 'waiting_customer', 'completed', 'cancelled', 'delivered'],
            default: "'pending'",
          },
          {
            name: 'estimatedCost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'actualCost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'laborCost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'partsCost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'diagnosis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'technicianNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'customerApproval',
            type: 'boolean',
            default: false,
          },
          {
            name: 'estimatedCompletionDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_WORK_ORDER_CUSTOMER',
            columnNames: ['customerId'],
          },
          {
            name: 'IDX_WORK_ORDER_VEHICLE',
            columnNames: ['vehicleId'],
          },
          {
            name: 'IDX_WORK_ORDER_STATUS',
            columnNames: ['status'],
          },
          {
            name: 'IDX_WORK_ORDER_CREATED_AT',
            columnNames: ['createdAt'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('work_orders');
  }
}
