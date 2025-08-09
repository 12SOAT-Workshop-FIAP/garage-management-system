import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';

export interface FindAllPartsFilters {
  category?: string;
  active?: boolean;
  minStock?: number;
}

@Injectable()
export class FindAllPartsService {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(filters?: FindAllPartsFilters): Promise<Part[]> {
    if (!filters) {
      return await this.partRepository.findAll();
    }

    // For now, return all parts, but in a real implementation,
    // you would filter based on the provided filters
    return await this.partRepository.findAll();
  }

  async findLowStock(): Promise<Part[]> {
    return await this.partRepository.findLowStockParts();
  }

  async findByCategory(category: string): Promise<Part[]> {
    return await this.partRepository.findByCategory(category);
  }
}
