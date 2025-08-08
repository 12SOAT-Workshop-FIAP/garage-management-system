import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkOrderStatus } from '../domain/work-order-status.enum';

/**
 * WorkOrderORM (Entidade TypeORM de Ordem de Serviço)
 * TypeORM entity for work order persistence.
 */
@Entity('work_orders')
export class WorkOrderORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column('uuid')
  vehicleId!: string;

  @Column('text')
  description!: string;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.PENDING,
  })
  status!: WorkOrderStatus;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  estimatedCost!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  laborCost?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  partsCost?: number;

  @Column('text', { nullable: true })
  diagnosis?: string;

  @Column('text', { nullable: true })
  technicianNotes?: string;

  @Column('boolean', { default: false })
  customerApproval!: boolean;

  @Column('timestamp', { nullable: true })
  estimatedCompletionDate?: Date;

  @Column('timestamp', { nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
