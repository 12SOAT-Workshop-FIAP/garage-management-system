import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { UpdatePartDto } from '../dtos/update-part.dto';

@Injectable()
export class UpdatePartUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string, updatePartDto: UpdatePartDto): Promise<Part> {
    const partId = parseInt(id);
    const originalPart = await this.partRepository.findById(partId);
    if (!originalPart) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    // Create a copy of the part for update
    const updatedPart = Part.restore({
      id: partId,
      name: originalPart.name.value,
      description: originalPart.description.value,
      partNumber: originalPart.partNumber.value,
      category: originalPart.category.value,
      price: originalPart.price.value,
      costPrice: originalPart.costPrice.value,
      stockQuantity: originalPart.stockQuantity.value,
      minStockLevel: originalPart.minStockLevel,
      unit: originalPart.unit.value,
      supplier: originalPart.supplier.value,
      active: originalPart.isActive,
      createdAt: originalPart.createdAt,
      updatedAt: originalPart.updatedAt,
    });

    // Update the part using the entity's update method
    updatedPart.update({
      name: updatePartDto.name,
      description: updatePartDto.description,
      category: updatePartDto.category,
      price: updatePartDto.price,
      costPrice: updatePartDto.costPrice,
      minStockLevel: updatePartDto.minStockLevel,
      unit: updatePartDto.unit,
      supplier: updatePartDto.supplier,
    });

    // Handle active/inactive status
    if (updatePartDto.active !== undefined) {
      if (updatePartDto.active) {
        updatedPart.activate();
      } else {
        updatedPart.deactivate();
      }
    }

    const result = await this.partRepository.update(originalPart, updatedPart);
    if (!result) {
      throw new NotFoundException('Failed to update part');
    }

    return result;
  }
}