import {
  Injectable,
  NotFoundException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreatePartUseCase } from '../../../application/use-cases/create-part.use-case';
import { UpdatePartUseCase } from '../../../application/use-cases/update-part.use-case';
import { DeletePartUseCase } from '../../../application/use-cases/delete-part.use-case';
import { FindAllPartsUseCase } from '../../../application/use-cases/find-all-parts.use-case';
import { FindPartByIdUseCase } from '../../../application/use-cases/find-part-by-id.use-case';
import { UpdateStockUseCase } from '../../../application/use-cases/update-stock.use-case';
import { CreatePartDto } from '../../../application/dtos/create-part.dto';
import { UpdatePartDto, UpdateStockDto } from '../../../application/dtos/update-part.dto';
import { PartResponseDto } from '../../dtos/part-response.dto';
import { CreatePartCommand } from '../../../application/commands/create-part.command';
import { DeletePartCommand } from '../../../application/commands/delete-part.command';
import { UpdateStockCommand } from '../../../application/commands/update-stock.command';
import { FindAllPartsQuery } from '../../../application/queries/find-all-parts.query';
import { FindPartByIdQuery } from '../../../application/queries/find-part-by-id.query';

@Controller('parts')
@Injectable()
export class PartHttpAdapter {
  constructor(
    private readonly createPartUseCase: CreatePartUseCase,
    private readonly updatePartUseCase: UpdatePartUseCase,
    private readonly deletePartUseCase: DeletePartUseCase,
    private readonly findAllPartsUseCase: FindAllPartsUseCase,
    private readonly findPartByIdUseCase: FindPartByIdUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPartDto: CreatePartDto): Promise<PartResponseDto> {
    const command = new CreatePartCommand(
      createPartDto.name,
      createPartDto.description,
      createPartDto.partNumber,
      createPartDto.category,
      createPartDto.price,
      createPartDto.costPrice,
      createPartDto.stockQuantity,
      createPartDto.minStockLevel,
      createPartDto.unit,
      createPartDto.supplier,
    );

    const part = await this.createPartUseCase.execute(command);
    return PartResponseDto.from(part);
  }

  @Get()
  async findAll(): Promise<PartResponseDto[]> {
    const query = new FindAllPartsQuery();
    const parts = await this.findAllPartsUseCase.execute(query);
    return parts.map((part) => PartResponseDto.from(part));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PartResponseDto> {
    const query = new FindPartByIdQuery(id);
    const part = await this.findPartByIdUseCase.execute(query);

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return PartResponseDto.from(part);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    const part = await this.updatePartUseCase.execute(id, updatePartDto);
    return PartResponseDto.from(part);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeletePartCommand(id);
    await this.deletePartUseCase.execute(command);
  }

  @Put(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<PartResponseDto> {
    const command = new UpdateStockCommand(id, updateStockDto.quantity);
    const part = await this.updateStockUseCase.execute(command);

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return PartResponseDto.from(part);
  }
}
