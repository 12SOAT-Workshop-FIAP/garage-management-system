import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

/**
 * Customer (Cliente)
 * Represents a customer of the garage (Cliente da oficina mecânica).
 *
 * @property id - Unique identifier
 * @property name - Customer's full name
 * @property person_type - Whether it's an individual or company
 * @property document - CPF or CNPJ
 * @property email - Email address
 * @property phone - Primary phone number
 * @property created_at - Creation timestamp
 * @property updated_at - Last update timestamp
 */
@Entity('customers')
@Unique(['document'])
export class CustomerEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'person_type', type: 'text' })
  personType!: 'INDIVIDUAL' | 'COMPANY';

  @Column()
  document!: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
  vehicles?: Vehicle[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ default: true })
  status!: boolean;
}
