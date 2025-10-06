import { Part } from '../../domain/entities/part.entity';

export class PartResponseDto {
  id?: number;
  name!: string;
  description!: string;
  partNumber!: string;
  category!: string;
  price!: number;
  costPrice!: number;
  stockQuantity!: number;
  minStockLevel!: number;
  unit!: string;
  supplier!: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static from(part: Part): PartResponseDto {
    const dto = new PartResponseDto();
    dto.id = part.id?.value;
    dto.name = part.name.value;
    dto.description = part.description.value;
    dto.partNumber = part.partNumber.value;
    dto.category = part.category.value;
    dto.price = part.price.value;
    dto.costPrice = part.costPrice.value;
    dto.stockQuantity = part.stockQuantity.value;
    dto.minStockLevel = part.minStockLevel;
    dto.unit = part.unit.value;
    dto.supplier = part.supplier.value;
    dto.active = part.status.value;
    dto.createdAt = part.createdAt;
    dto.updatedAt = part.updatedAt;
    return dto;
  }
}
