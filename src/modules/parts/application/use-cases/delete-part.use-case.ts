import { Injectable, NotFoundException } from '@nestjs/common';
import { PartRepository } from '../../domain/repositories/part.repository';
import { DeletePartCommand } from '../commands/delete-part.command';

@Injectable()
export class DeletePartUseCase {
  constructor(
    private readonly partRepository: PartRepository,
  ) {}

  async execute(command: DeletePartCommand): Promise<void> {
    const part = await this.partRepository.findById(command.id);
    if (!part) {
      throw new NotFoundException('Part not found');
    }
    
    await this.partRepository.delete(part);
  }
}