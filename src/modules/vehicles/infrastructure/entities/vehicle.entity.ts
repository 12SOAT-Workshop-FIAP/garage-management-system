import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Vehicle TypeORM Entity
 * Database representation of a vehicle
 */
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  licensePlate!: string;

  @CreateDateColumn()
  created_at!: Date;
}
