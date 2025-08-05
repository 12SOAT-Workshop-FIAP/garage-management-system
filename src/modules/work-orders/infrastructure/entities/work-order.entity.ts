import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * WorkOrder TypeORM Entity
 * Database representation of a work order
 */
@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  created_at!: Date;
}
