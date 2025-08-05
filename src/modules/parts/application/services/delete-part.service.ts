import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PartRepository } from '../../domain/part.repository';
import { PART_REPOSITORY } from '../../infrastructure/repositories/part.typeorm.repository';

@Injectable()
export class DeletePartService {
  constructor(
    @Inject(PART_REPOSITORY)
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const part = await this.partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    
    await this.partRepository.delete(id);
  }
}
