import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../../domain/part.entity';

/**
 * PartResponseDto (DTO de resposta de Peça/Insumo)
 * Data Transfer Object for part responses.
 */
export class PartResponseDto {
  @ApiProperty({ 
    description: "Part unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id!: string;

  @ApiProperty({ 
    description: "Part name",
    example: "Brake Pad Set"
  })
  name!: string;

  @ApiProperty({ 
    description: "Part description",
    example: "High performance ceramic brake pads for front wheels",
    nullable: true
  })
  description?: string;

  @ApiProperty({ 
    description: "Manufacturer part number",
    example: "BP-001-CERAMIC",
    nullable: true
  })
  partNumber?: string;

  @ApiProperty({ 
    description: "Part category",
    example: "brake"
  })
  category!: string;

  @ApiProperty({ 
    description: "Unit price in currency",
    example: 89.99
  })
  price!: number;

  @ApiProperty({ 
    description: "Cost price for inventory control",
    example: 65.50
  })
  costPrice!: number;

  @ApiProperty({ 
    description: "Current stock quantity",
    example: 25
  })
  stockQuantity!: number;

  @ApiProperty({ 
    description: "Minimum stock level for alerts",
    example: 5
  })
  minStockLevel!: number;

  @ApiProperty({ 
    description: "Unit of measurement",
    example: "piece"
  })
  unit!: string;

  @ApiProperty({ 
    description: "Supplier information",
    example: "AutoParts Inc.",
    nullable: true
  })
  supplier?: string;

  @ApiProperty({ 
    description: "Whether the part is active/available",
    example: true
  })
  active!: boolean;

  @ApiProperty({ 
    description: "Whether the part stock is below minimum level",
    example: false
  })
  isLowStock!: boolean;

  @ApiProperty({ 
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00Z"
  })
  created_at!: Date;

  @ApiProperty({ 
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00Z"
  })
  updated_at!: Date;

  /**
   * Creates a PartResponseDto from a Part entity
   * (Cria um PartResponseDto a partir de uma entidade Part)
   */
  static fromEntity(part: Part): PartResponseDto {
    const dto = new PartResponseDto();
    dto.id = part.id;
    dto.name = part.name;
    dto.description = part.description;
    dto.partNumber = part.partNumber;
    dto.category = part.category;
    dto.price = part.price;
    dto.costPrice = part.costPrice;
    dto.stockQuantity = part.stockQuantity;
    dto.minStockLevel = part.minStockLevel;
    dto.unit = part.unit;
    dto.supplier = part.supplier;
    dto.active = part.active;
    dto.isLowStock = part.isLowStock();
    dto.created_at = part.created_at;
    dto.updated_at = part.updated_at;
    return dto;
  }

  /**
   * Creates an array of PartResponseDto from Part entities
   * (Cria um array de PartResponseDto a partir de entidades Part)
   */
  static fromEntities(parts: Part[]): PartResponseDto[] {
    return parts.map(part => PartResponseDto.fromEntity(part));
  }
}

/**
 * PartStockStatusDto (DTO de status de estoque)
 * Data Transfer Object for part stock status responses.
 */
export class PartStockStatusDto {
  @ApiProperty({ 
    description: "Part unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id!: string;

  @ApiProperty({ 
    description: "Part name",
    example: "Brake Pad Set"
  })
  name!: string;

  @ApiProperty({ 
    description: "Current stock quantity",
    example: 25
  })
  stockQuantity!: number;

  @ApiProperty({ 
    description: "Minimum stock level for alerts",
    example: 5
  })
  minStockLevel!: number;

  @ApiProperty({ 
    description: "Whether the part stock is below minimum level",
    example: false
  })
  isLowStock!: boolean;

  @ApiProperty({ 
    description: "Whether there is enough stock for the requested quantity",
    example: true
  })
  hasStock!: boolean;

  static fromEntity(part: Part, requiredQuantity?: number): PartStockStatusDto {
    const dto = new PartStockStatusDto();
    dto.id = part.id;
    dto.name = part.name;
    dto.stockQuantity = part.stockQuantity;
    dto.minStockLevel = part.minStockLevel;
    dto.isLowStock = part.isLowStock();
    dto.hasStock = requiredQuantity ? part.hasStock(requiredQuantity) : true;
    return dto;
  }
}
