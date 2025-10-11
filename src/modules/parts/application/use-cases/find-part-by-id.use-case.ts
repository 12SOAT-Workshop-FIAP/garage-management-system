import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { FindPartByIdQuery } from '../queries/find-part-by-id.query';

@Injectable()
export class FindPartByIdUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(query: FindPartByIdQuery): Promise<Part | null> {
    return await this.partRepository.findById(query.id);
  }
}