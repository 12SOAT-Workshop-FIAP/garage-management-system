import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';
import { UpdatePartDto } from '../dtos/update-part.dto';

@Injectable()
export class UpdatePartService {
  constructor(
    @Inject('PartRepository')
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string, updatePartDto: UpdatePartDto): Promise<Part> {
    const existingPart = await this.partRepository.findById(id);
    if (!existingPart) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    // Check if part number is being changed and if it already exists
    if (updatePartDto.partNumber && updatePartDto.partNumber !== existingPart.partNumber) {
      const partWithSameNumber = await this.partRepository.findByPartNumber(updatePartDto.partNumber);
      if (partWithSameNumber && partWithSameNumber.id !== id) {
        throw new ConflictException(`Part with number ${updatePartDto.partNumber} already exists`);
      }
    }

    // Update only provided fields
    if (updatePartDto.name !== undefined) existingPart.name = updatePartDto.name;
    if (updatePartDto.description !== undefined) existingPart.description = updatePartDto.description;
    if (updatePartDto.partNumber !== undefined) existingPart.partNumber = updatePartDto.partNumber;
    if (updatePartDto.category !== undefined) existingPart.category = updatePartDto.category;
    if (updatePartDto.price !== undefined) existingPart.price = updatePartDto.price;
    if (updatePartDto.costPrice !== undefined) existingPart.costPrice = updatePartDto.costPrice;
    if (updatePartDto.minStockLevel !== undefined) existingPart.minStockLevel = updatePartDto.minStockLevel;
    if (updatePartDto.unit !== undefined) existingPart.unit = updatePartDto.unit;
    if (updatePartDto.supplier !== undefined) existingPart.supplier = updatePartDto.supplier;
    if (updatePartDto.active !== undefined) existingPart.active = updatePartDto.active;

    return await this.partRepository.save(existingPart);
  }
}
