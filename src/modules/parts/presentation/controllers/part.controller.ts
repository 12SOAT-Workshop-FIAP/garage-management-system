import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
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

  @Post()
  async create(@Body() createPartDto: CreatePartDto) {
    await this.createPart.execute(createPartDto);
  }

  @Get()
  async findAll() {
    const parts = await this.findAllParts.execute();
    return parts.map((part) => new PartResponseDto(part));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const part = await this.findPartById.execute(id);
    return new PartResponseDto(part);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    await this.updatePart.execute(id, updatePartDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deletePart.execute(id);
  }

  @Patch(':id/stock')
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    const part = await this.updateStockService.execute(id, dto);
    return new PartResponseDto(part);
  }
}
