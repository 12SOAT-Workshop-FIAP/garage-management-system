import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Part (Peça/Insumo)
 * Represents a part or supply item used in garage services.
 * (Representa uma peça ou insumo utilizado nos serviços da oficina).
 *
 * @property id - Unique identifier (UUID)
 * @property name - Part name
 * @property description - Part description
 * @property partNumber - Manufacturer part number
 * @property category - Part category (e.g., engine, brake, oil, etc.)
 * @property price - Unit price
 * @property costPrice - Cost price for inventory control
 * @property stockQuantity - Current stock quantity
 * @property minStockLevel - Minimum stock level for alerts
 * @property unit - Unit of measurement (piece, liter, kg, etc.)
 * @property supplier - Supplier information
 * @property active - Whether the part is active/available
 * @property created_at - Creation timestamp
 * @property updated_at - Last update timestamp
 */
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

  @Column({ length: 20, default: 'piece' })
  unit!: string;

  @Column({ length: 100, nullable: true })
  supplier?: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  /**
   * Checks if the part stock is below minimum level
   * (Verifica se o estoque da peça está abaixo do nível mínimo)
   */
  isLowStock(): boolean {
    return this.stockQuantity <= this.minStockLevel;
  }

  /**
   * Updates stock quantity
   * (Atualiza a quantidade em estoque)
   */
  updateStock(quantity: number): void {
    this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
    this.updated_at = new Date();
  }

  /**
   * Checks if enough stock is available
   * (Verifica se há estoque suficiente disponível)
   */
  hasStock(requiredQuantity: number): boolean {
    return this.stockQuantity >= requiredQuantity;
  }
}
