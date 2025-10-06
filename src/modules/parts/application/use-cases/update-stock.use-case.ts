import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { UpdateStockDto } from '../dtos/update-part.dto';

@Injectable()
export class UpdateStockUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string, updateStockDto: UpdateStockDto): Promise<Part> {
    const part = await this.partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    // Check if the update would result in negative stock
    const newStockQuantity = part.stockQuantity + updateStockDto.stockQuantity;
    if (newStockQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    part.updateStock(updateStockDto.stockQuantity);
    return await this.partRepository.save(part);
  }
}