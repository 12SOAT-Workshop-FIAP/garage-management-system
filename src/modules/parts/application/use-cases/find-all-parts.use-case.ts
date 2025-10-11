import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { FindAllPartsQuery } from '../queries/find-all-parts.query';

@Injectable()
export class FindAllPartsUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(query: FindAllPartsQuery): Promise<Part[]> {
    const parts = await this.partRepository.findAll();
    return parts || [];
  }

  async findByCategory(category: string): Promise<Part[]> {
    return await this.partRepository.findByCategory(category);
  }
}