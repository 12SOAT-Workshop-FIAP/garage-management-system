import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { WorkOrderServiceORM } from './work-order-service.entity';
import { WorkOrderPartORM } from './work-order-part.entity';
import { CustomerEntity } from '../../../customers/infrastructure/customer.entity';

/**
 * WorkOrderORM (Entidade TypeORM de Ordem de Serviço)
 * TypeORM entity for work order persistence.
 */
@Entity('work_orders')
export class WorkOrderORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  customerId!: number;

  @Column('int')
  vehicleId!: number;

  @Column('text')
  description!: string;

  @Column('varchar', {
    length: 20,
    default: 'PENDING',
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

  @Column('uuid', { nullable: true })
  assignedTechnicianId?: string;

  @Column('timestamp', { nullable: true })
  estimatedCompletionDate?: Date;

  @Column('timestamp', { nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamentos
  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer?: CustomerEntity;

  // Relacionamento com serviços da ordem de serviço
  @OneToMany(() => WorkOrderServiceORM, (service) => service.workOrder, {
    cascade: true,
    eager: false,
  })
  services!: WorkOrderServiceORM[];

  // Relacionamento com peças da ordem de serviço
  @OneToMany(() => WorkOrderPartORM, (part) => part.workOrder, {
    cascade: true,
    eager: false,
  })
  parts!: WorkOrderPartORM[];
}
