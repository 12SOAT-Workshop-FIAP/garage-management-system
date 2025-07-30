import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';
import { UpdateStockDto } from '../dtos/update-part.dto';

@Injectable()
export class UpdateStockService {
  constructor(
    @Inject('PartRepository')
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string, updateStockDto: UpdateStockDto): Promise<Part> {
    const part = await this.partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    const newQuantity = part.stockQuantity + updateStockDto.quantity;

    // Check if the operation would result in negative stock
    if (newQuantity < 0) {
      throw new BadRequestException(
        `Cannot reduce stock by ${Math.abs(updateStockDto.quantity)}. Current stock: ${part.stockQuantity}`
      );
    }

    // Update stock using entity method
    part.updateStock(updateStockDto.quantity);

    return await this.partRepository.save(part);
  }
}
