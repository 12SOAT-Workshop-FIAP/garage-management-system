import { Injectable, NotFoundException } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';

@Injectable()
export class FindPartByIdService {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string): Promise<Part> {
    const part = await this.partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    return part;
  }
}
