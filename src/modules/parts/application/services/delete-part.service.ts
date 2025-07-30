import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PartRepository } from '../../domain/part.repository';

@Injectable()
export class DeletePartService {
  constructor(
    @Inject('PartRepository')
    private readonly partRepository: PartRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingPart = await this.partRepository.findById(id);
    if (!existingPart) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    await this.partRepository.delete(id);
  }
}
