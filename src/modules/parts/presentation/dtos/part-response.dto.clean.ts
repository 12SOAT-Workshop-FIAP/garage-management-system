import { Part } from '../../domain/entities/part.entity';

export class PartResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  partNumber!: string | null;
  category!: string;
  price!: number;
  stockQuantity!: number;
  minStockLevel!: number;
  maxStockLevel!: number;
  location!: string | null;
  supplier!: string | null;
  active!: boolean;
  created_at!: Date;
  updated_at!: Date;

  static from(part: Part): PartResponseDto {
    const dto = new PartResponseDto();
    dto.id = part.id?.value?.toString() || '';
    dto.name = part.name.value;
    dto.description = part.description.value || null;
    dto.partNumber = part.partNumber.value || null;
    dto.category = part.category.value;
    dto.price = part.price.value;
    dto.stockQuantity = part.stockQuantity.value;
    dto.minStockLevel = part.minStockLevel;
    dto.maxStockLevel = part.minStockLevel; 
    dto.location = null; 
    dto.supplier = part.supplier.value || null;
    dto.active = part.isActive;
    dto.created_at = part.createdAt;
    dto.updated_at = part.updatedAt;
    return dto;
  }

  static fromList(parts: Part[]): PartResponseDto[] {
    return parts.map(part => PartResponseDto.from(part));
  }
}

export class PartStockStatusDto {
  id!: string;
  name!: string;
  currentStock!: number;
  requiredQuantity!: number;
  hasSufficientStock!: boolean;
  shortfall!: number;

  static from(part: Part, requiredQuantity: number): PartStockStatusDto {
    const dto = new PartStockStatusDto();
    dto.id = part.id?.value?.toString() || '';
    dto.name = part.name.value;
    dto.currentStock = part.stockQuantity.value;
    dto.requiredQuantity = requiredQuantity;
    dto.hasSufficientStock = part.stockQuantity.value >= requiredQuantity;
    dto.shortfall = Math.max(0, requiredQuantity - part.stockQuantity.value);
    return dto;
  }
}
