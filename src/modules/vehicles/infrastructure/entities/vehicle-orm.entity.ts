import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleOrmEntity {
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
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
