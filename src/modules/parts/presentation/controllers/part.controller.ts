import { CreatePartDto } from '../../application/dtos/create-part.dto';
import { UpdatePartDto } from '../../application/dtos/update-part.dto';
import { CreatePartUseCase } from '../../application/use-cases/create-part.use-case';
import { DeletePartUseCase } from '../../application/use-cases/delete-part.use-case';
import { FindAllPartsUseCase } from '../../application/use-cases/find-all-parts.use-case';
import { FindPartByIdUseCase } from '../../application/use-cases/find-part-by-id.use-case';
import { UpdatePartUseCase } from '../../application/use-cases/update-part.use-case';
import { UpdateStockUseCase } from '../../application/use-cases/update-stock.use-case';
import { PartResponseDto } from '../dtos/part-response.dto';
import { UpdateStockDto } from '../../application/dtos/update-part.dto';
import { FindAllPartsQuery } from '../../application/queries/find-all-parts.query';
import { FindPartByIdQuery } from '../../application/queries/find-part-by-id.query';
import { DeletePartCommand } from '../../application/commands/delete-part.command';
import { UpdateStockCommand } from '../../application/commands/update-stock.command';
import { Controller } from '@nestjs/common';

@Controller('parts')
export class PartController {
  constructor(
    private readonly createPart: CreatePartUseCase,
    private readonly updatePart: UpdatePartUseCase,
    private readonly deletePart: DeletePartUseCase,
    private readonly findAllParts: FindAllPartsUseCase,
    private readonly findPartById: FindPartByIdUseCase,
    private readonly updateStockService: UpdateStockUseCase,
  ) {}

  async create(createPartDto: CreatePartDto) {
    return await this.createPart.execute(createPartDto);
  }

  async findAll() {
    const query = new FindAllPartsQuery();
    const parts = await this.findAllParts.execute(query);
    return parts.map((part) => PartResponseDto.from(part));
  }

  async findOne(id: string) {
    const query = new FindPartByIdQuery(parseInt(id));
    const part = await this.findPartById.execute(query);
    if (!part) {
      throw new Error('Part not found');
    }
    return PartResponseDto.from(part);
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    return await this.updatePart.execute(id, updatePartDto);
  }

  async remove(id: string) {
    const command = new DeletePartCommand(parseInt(id));
    await this.deletePart.execute(command);
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    const command = new UpdateStockCommand(parseInt(id), dto.quantity);
    const part = await this.updateStockService.execute(command);
    if (!part) {
      throw new Error('Part not found');
    }
    return PartResponseDto.from(part);
  }
}
