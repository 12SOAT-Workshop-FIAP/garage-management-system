import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { FindPartByPartNumberQuery } from '../queries/find-part-by-part-number.query';

@Injectable()
export class FindPartByPartNumberUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(query: FindPartByPartNumberQuery): Promise<Part | null> {
    return await this.partRepository.findByPartNumber(query.partNumber);
  }
}