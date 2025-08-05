import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 50, nullable: true, name: 'part_number' })
  partNumber?: string;

  @Column({ length: 50 })
  category!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'cost_price' })
  costPrice!: number;

  @Column({ type: 'int', default: 0, name: 'stock_quantity' })
  stockQuantity!: number;

  @Column({ type: 'int', default: 1, name: 'min_stock_level' })
  minStockLevel!: number;

  @Column({ length: 20 })
  unit!: string;

  @Column({ type: 'text', nullable: true })
  supplier?: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
