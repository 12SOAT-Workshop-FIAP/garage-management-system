import { Injectable, ConflictException } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';
import { CreatePartDto } from '../dtos/create-part.dto';

@Injectable()
export class CreatePartService {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(createPartDto: CreatePartDto): Promise<Part> {
    // Check if part number already exists (only if not empty)
    if (createPartDto.partNumber && createPartDto.partNumber.trim()) {
      const existingPart = await this.partRepository.findByPartNumber(createPartDto.partNumber);
      if (existingPart) {
        throw new ConflictException(`Part with number ${createPartDto.partNumber} already exists`);
      }
    }

    const part = new Part(createPartDto);
    return await this.partRepository.save(part);
  }
}
