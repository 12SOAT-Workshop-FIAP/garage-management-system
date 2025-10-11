import { Injectable, ConflictException } from '@nestjs/common';
import { PartRepository } from '../../domain/repositories/part.repository';
import { CreatePartCommand } from '../commands/create-part.command';
import { Part } from '../../domain/entities/part.entity';

@Injectable()
export class CreatePartUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(command: CreatePartCommand): Promise<Part> {
    // Verificar se part number já existe
    const existingPart = await this.partRepository.findByPartNumber(command.partNumber);
    if (existingPart) {
      throw new ConflictException('Part number already exists');
    }

    const part = Part.create({
      name: command.name,
      description: command.description,
      partNumber: command.partNumber,
      category: command.category,
      price: command.price,
      costPrice: command.costPrice,
      stockQuantity: command.stockQuantity,
      minStockLevel: command.minStockLevel,
      unit: command.unit,
      supplier: command.supplier,
    });

    return await this.partRepository.create(part);
  }
}