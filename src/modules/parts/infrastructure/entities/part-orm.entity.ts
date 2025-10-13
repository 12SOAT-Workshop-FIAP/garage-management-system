import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 1. Adicione o decorador @Entity() para marcar como uma tabela
@Entity('parts') // Opcional: defina o nome da tabela, senão será 'part_orm_entity'
export class PartOrmEntity {
  // 2. Defina a coluna 'id' como uma chave primária UUID gerada automaticamente
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ unique: true }) // Part Number geralmente é único
  partNumber!: string;

  @Column()
  category!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice!: number;

  @Column('int')
  stockQuantity!: number;

  @Column('int')
  minStockLevel!: number;

  @Column()
  unit!: string;

  @Column()
  supplier!: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
