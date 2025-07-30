import { Injectable, Inject } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';

@Injectable()
export class FindAllPartsService {
  constructor(
    @Inject('PartRepository')
    private readonly partRepository: PartRepository,
  ) {}

  async execute(filters?: {
    category?: string;
    active?: boolean;
    lowStock?: boolean;
    name?: string;
  }): Promise<Part[]> {
    return await this.partRepository.findAll(filters);
  }

  async findLowStock(): Promise<Part[]> {
    return await this.partRepository.findLowStockParts();
  }

  async findByCategory(category: string): Promise<Part[]> {
    return await this.partRepository.findByCategory(category);
  }
}
