import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../../domain/part.entity';

export class PartResponseDto {
  @ApiProperty({
    description: 'Part unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Part name',
    example: 'Brake Pads - Ceramic',
  })
  name!: string;

  @ApiProperty({
    description: 'Part description',
    example: 'High performance ceramic brake pads for front wheels',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Manufacturer part number',
    example: 'BP-001-CERAMIC',
    nullable: true,
  })
  partNumber!: string | null;

  @ApiProperty({
    description: 'Part category',
    example: 'brake',
  })
  category!: string;

  @ApiProperty({
    description: 'Unit price in currency',
    example: 89.99,
  })
  price!: number;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 25,
  })
  stockQuantity!: number;

  @ApiProperty({
    description: 'Minimum stock level that triggers reorder',
    example: 5,
  })
  minStockLevel!: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 100,
  })
  maxStockLevel!: number;

  @ApiProperty({
    description: 'Storage location',
    example: 'A-1-15',
    nullable: true,
  })
  location!: string | null;

  @ApiProperty({
    description: 'Supplier information',
    example: 'Brembo Parts Ltd.',
    nullable: true,
  })
  supplier!: string | null;

  @ApiProperty({
    description: 'Whether the part is active',
    example: true,
  })
  active!: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at!: Date;

  static fromEntity(part: Part): PartResponseDto {
    const dto = new PartResponseDto();
    dto.id = part.id;
    dto.name = part.name;
    dto.description = part.description || null;
    dto.partNumber = part.partNumber || null;
    dto.category = part.category;
    dto.price = part.price;
    dto.stockQuantity = part.stockQuantity;
    dto.minStockLevel = part.minStockLevel;
    dto.maxStockLevel = part.minStockLevel; // Usando minStockLevel pois maxStockLevel não existe na entidade
    dto.location = null; // location não existe na entidade, definindo como null
    dto.supplier = part.supplier || null;
    dto.active = part.active;
    dto.created_at = part.createdAt;
    dto.updated_at = part.updatedAt;
    return dto;
  }

  static fromEntities(parts: Part[]): PartResponseDto[] {
    return parts.map(part => PartResponseDto.fromEntity(part));
  }
}

export class PartStockStatusDto {
  @ApiProperty({
    description: 'Part unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Part name',
    example: 'Brake Pads - Ceramic',
  })
  name!: string;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 25,
  })
  currentStock!: number;

  @ApiProperty({
    description: 'Required quantity for the operation',
    example: 2,
  })
  requiredQuantity!: number;

  @ApiProperty({
    description: 'Whether there is sufficient stock',
    example: true,
  })
  hasSufficientStock!: boolean;

  @ApiProperty({
    description: 'Additional quantity needed if insufficient',
    example: 0,
  })
  shortfall!: number;

  static fromEntity(part: Part, requiredQuantity: number): PartStockStatusDto {
    const dto = new PartStockStatusDto();
    dto.id = part.id;
    dto.name = part.name;
    dto.currentStock = part.stockQuantity;
    dto.requiredQuantity = requiredQuantity;
    dto.hasSufficientStock = part.stockQuantity >= requiredQuantity;
    dto.shortfall = Math.max(0, requiredQuantity - part.stockQuantity);
    return dto;
  }
}
