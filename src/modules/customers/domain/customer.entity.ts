import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Customer (Cliente)
 * Represents a customer of the garage (Cliente da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property name - Customer's name
 * @property created_at - Creation timestamp
 */
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  // TODO: Add Value Objects and domain methods
}
