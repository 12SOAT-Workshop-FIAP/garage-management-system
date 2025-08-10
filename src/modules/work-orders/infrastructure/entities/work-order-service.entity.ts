import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { WorkOrderORM } from './work-order.entity';

/**
 * WorkOrderServiceORM
 * Entidade TypeORM para persistir os serviços de uma ordem de serviço
 */
@Entity('work_order_services')
export class WorkOrderServiceORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  workOrderId!: string;

  @Column('uuid')
  serviceId!: string;

  @Column('varchar', { length: 255 })
  serviceName!: string;

  @Column('text')
  serviceDescription!: string;

  @Column('int', { default: 1 })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column('int') // duration in minutes
  estimatedDuration!: number;

  @Column('int', { nullable: true }) // actual duration in minutes
  actualDuration?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column('varchar', { 
    length: 20,
    default: 'PENDING'
  })
  status!: string;

  @Column('timestamp', { nullable: true })
  startedAt?: Date;

  @Column('timestamp', { nullable: true })
  completedAt?: Date;

  @Column('text', { nullable: true })
  technicianNotes?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @ManyToOne(() => WorkOrderORM, workOrder => workOrder.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workOrderId' })
  workOrder!: WorkOrderORM;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
