import { Injectable, NotFoundException } from '@nestjs/common';
import { PartRepository } from '../../domain/repositories/part.repository';

@Injectable()
export class DeletePartUseCase {
  constructor(
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