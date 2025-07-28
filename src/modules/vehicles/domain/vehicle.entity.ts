import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/domain/customer.entity';

@Entity('vehicles')
export class Vehicle {
  // agora ID numérico sequencial
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ unique: true })
  plate!: string;

  @Column()
  year!: number;

  // FK continua UUID 
  @Column('uuid')
  customer_id!: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @CreateDateColumn()
  created_at!: Date;
}
