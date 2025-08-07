import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ unique: true })
  plate!: string;

  @Column()
  year!: number;
  
  // chave estrangeira
  @Column()
  customer_id!: number;

  @ManyToOne(() => CustomerEntity)
  // decorador para vincular a coluna
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerEntity;

  @CreateDateColumn()
  created_at!: Date;
}