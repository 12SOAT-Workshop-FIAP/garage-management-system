import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/domain/customer.entity';

/**
 * Vehicle (Veículo)
 * Represents a customer's vehicle registered in the garage system.
 *
 * @property id - Unique identifier (UUID)
 * @property brand - Vehicle's brand (ex: Fiat, Ford)
 * @property model - Vehicle's model (ex: Uno, Focus)
 * @property plate - Vehicle's license plate
 * @property year - Year of manufacture
 * @property customer - Associated customer (foreign key)
 * @property created_at - Creation timestamp
 */
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ unique: true }) // Para não permitir duplicação de placa
  plate!: string;

  @Column()
  year!: number;

  @Column()
  customer_id!: string;  // Campo que armazena o ID do cliente (FK - foreing key)

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @CreateDateColumn()
  created_at!: Date;

  // TODO: Add Value Objects and domain methods
}
