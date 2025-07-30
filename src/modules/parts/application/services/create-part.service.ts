import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';
import { CreatePartDto } from '../dtos/create-part.dto';

@Injectable()
export class CreatePartService {
  constructor(
    @Inject('PartRepository')
    private readonly partRepository: PartRepository,
  ) {}

  async execute(createPartDto: CreatePartDto): Promise<Part> {
    // Check if part number already exists (if provided)
    if (createPartDto.partNumber) {
      const existingPart = await this.partRepository.findByPartNumber(createPartDto.partNumber);
      if (existingPart) {
        throw new ConflictException(`Part with number ${createPartDto.partNumber} already exists`);
      }
    }

    const part = new Part();
    part.name = createPartDto.name;
    part.description = createPartDto.description;
    part.partNumber = createPartDto.partNumber;
    part.category = createPartDto.category;
    part.price = createPartDto.price;
    part.costPrice = createPartDto.costPrice;
    part.stockQuantity = createPartDto.stockQuantity || 0;
    part.minStockLevel = createPartDto.minStockLevel || 1;
    part.unit = createPartDto.unit || 'piece';
    part.supplier = createPartDto.supplier;
    part.active = createPartDto.active !== undefined ? createPartDto.active : true;

    return await this.partRepository.save(part);
  }
}
