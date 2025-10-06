import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { FindLowStockPartsQuery } from '../queries/find-low-stock-parts.query';

@Injectable()
export class FindLowStockPartsUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(query: FindLowStockPartsQuery): Promise<Part[]> {
    return await this.partRepository.findLowStockParts();
  }
}