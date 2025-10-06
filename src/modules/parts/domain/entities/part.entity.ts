import { randomUUID } from 'crypto';

export class Part {
  id: string;
  name: string;
  description: string;
  partNumber: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  supplier: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: {
      name: string;
      description: string;
      partNumber: string;
      category: string;
      price: number;
      costPrice: number;
      stockQuantity: number;
      minStockLevel: number;
      unit: string;
      supplier: string;
      active: boolean;
    },
    id?: string,
  ) {
    this.id = id || randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.partNumber = props.partNumber;
    this.category = props.category;
    this.price = props.price;
    this.costPrice = props.costPrice;
    this.stockQuantity = props.stockQuantity;
    this.minStockLevel = props.minStockLevel;
    this.unit = props.unit;
    this.supplier = props.supplier;
    this.active = props.active;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Domain methods
  updateStock(quantity: number): void {
    // quantity here represents a delta: positive (entry) or negative (consumption)
    this.stockQuantity = this.stockQuantity + quantity;
    this.updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this.stockQuantity <= this.minStockLevel;
  }

  hasStock(requiredQuantity: number): boolean {
    return this.stockQuantity >= requiredQuantity;
  }
}
