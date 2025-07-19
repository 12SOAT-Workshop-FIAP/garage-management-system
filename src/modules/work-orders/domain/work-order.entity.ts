import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * WorkOrder (Ordem de Serviço)
 * Represents a work order in the garage (Ordem de Serviço da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property description - Work order description
 * @property created_at - Creation timestamp
 */
@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  created_at!: Date;

  // TODO: Add Value Objects and domain methods
}
