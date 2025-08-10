import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { WorkOrderORM } from './work-order.entity';
import { Part } from '../../../parts/infrastructure/entities/part.entity';

/**
 * WorkOrderPartORM
 * Entidade TypeORM para persistir as peças de uma ordem de serviço
 */
@Entity('work_order_parts')
export class WorkOrderPartORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  workOrderId!: string;

  @Column('uuid')
  partId!: string;

  @Column('varchar', { length: 255 })
  partName!: string;

  @Column('text')
  partDescription!: string;

  @Column('varchar', { length: 100 })
  partNumber!: string;

  @Column('int', { default: 1 })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('boolean', { default: false })
  isApproved!: boolean;

  @Column('timestamp', { nullable: true })
  appliedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamentos
  @ManyToOne(() => WorkOrderORM, (workOrder) => workOrder.parts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workOrderId' })
  workOrder!: WorkOrderORM;

  @ManyToOne(() => Part, { eager: false })
  @JoinColumn({ name: 'partId' })
  part?: Part;
}
