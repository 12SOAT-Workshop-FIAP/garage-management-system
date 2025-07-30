import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => CustomerEntity, (customer) => customer.vehicles)
  customer!: CustomerEntity;

  @CreateDateColumn()
  created_at!: Date;
}
