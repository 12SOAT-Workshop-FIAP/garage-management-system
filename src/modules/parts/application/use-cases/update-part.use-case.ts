import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { UpdatePartDto } from '../dtos/update-part.dto';

@Injectable()
export class UpdatePartUseCase {
  constructor(private readonly partRepository: PartRepository) {}

  async execute(id: string, updatePartDto: UpdatePartDto): Promise<Part> {
    const originalPart = await this.partRepository.findById(id);
    if (!originalPart) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    // Create a copy of the part for update
    const updatedPart = Part.restore({
      id: id,
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

    // Check if partNumber is being updated and if it conflicts
    if (updatePartDto.partNumber && updatePartDto.partNumber !== originalPart.partNumber.value) {
      const existingPart = await this.partRepository.findByPartNumber(updatePartDto.partNumber);
      if (existingPart && existingPart.id?.value !== id) {
        throw new ConflictException('Part number already exists');
      }
    }

    // Update the part using the entity's update method
    updatedPart.update({
      name: updatePartDto.name,
      description: updatePartDto.description,
      partNumber: updatePartDto.partNumber,
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
