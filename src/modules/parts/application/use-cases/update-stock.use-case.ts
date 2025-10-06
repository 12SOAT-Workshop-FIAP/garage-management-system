import { Injectable } from '@nestjs/common';
import { Part } from '../../domain/entities/part.entity';
import { PartRepository } from '../../domain/repositories/part.repository';
import { UpdateStockCommand } from '../commands/update-stock.command';

@Injectable()
export class UpdateStockUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(command: UpdateStockCommand): Promise<Part | null> {
    return await this.partRepository.updateStock(command.id, command.quantity);
  }
}