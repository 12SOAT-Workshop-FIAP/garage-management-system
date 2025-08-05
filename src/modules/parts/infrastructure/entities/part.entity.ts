import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ name: 'part_number' })
  partNumber!: string;

  @Column()
  category!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'cost_price' })
  costPrice!: number;

  @Column('int', { name: 'stock_quantity' })
  stockQuantity!: number;

  @Column('int', { name: 'min_stock_level' })
  minStockLevel!: number;

  @Column()
  unit!: string;

  @Column()
  supplier!: string;

  @Column()
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
