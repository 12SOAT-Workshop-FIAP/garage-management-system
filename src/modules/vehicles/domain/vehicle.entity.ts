import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  brand!: string;

  @Column({ length: 50 })
  model!: string;

  @Column({ unique: true })
  plate!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'int' })
  customerId!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
