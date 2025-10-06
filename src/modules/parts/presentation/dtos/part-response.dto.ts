import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../../domain/entities/part.entity';

export class PartResponseDto {
  @ApiProperty({ description: 'Part unique identifier' })
  id: string;

  @ApiProperty({ description: 'Part name' })
  name: string;

  @ApiProperty({ description: 'Part description' })
  description: string;

  @ApiProperty({ description: 'Part number' })
  partNumber: string;

  @ApiProperty({ description: 'Part category' })
  category: string;

  @ApiProperty({ description: 'Part price' })
  price: number;

  @ApiProperty({ description: 'Part cost price' })
  costPrice: number;

  @ApiProperty({ description: 'Stock quantity' })
  stockQuantity: number;

  @ApiProperty({ description: 'Minimum stock level' })
  minStockLevel: number;

  @ApiProperty({ description: 'Unit of measurement' })
  unit: string;

  @ApiProperty({ description: 'Supplier' })
  supplier: string;

  @ApiProperty({ description: 'Part active status' })
  active: boolean;

  @ApiProperty({ description: 'Part creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Part last update date' })
  updatedAt: Date;

  constructor(part: Part) {
    this.id = part.id;
    this.name = part.name;
    this.description = part.description;
    this.partNumber = part.partNumber;
    this.category = part.category;
    this.price = part.price;
    this.costPrice = part.costPrice;
    this.stockQuantity = part.stockQuantity;
    this.minStockLevel = part.minStockLevel;
    this.unit = part.unit;
    this.supplier = part.supplier;
    this.active = part.active;
    this.createdAt = part.createdAt;
    this.updatedAt = part.updatedAt;
  }
}
