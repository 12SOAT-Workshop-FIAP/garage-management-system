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
} from '@nestjs/common';
import { CreatePartDto } from '../../application/dtos/create-part.dto';
import { UpdatePartDto } from '../../application/dtos/update-part.dto';
import { CreatePartService } from '../../application/services/create-part.service';
import { DeletePartService } from '../../application/services/delete-part.service';
import { FindAllPartsService } from '../../application/services/find-all-parts.service';
import { FindPartByIdService } from '../../application/services/find-part-by-id.service';
import { UpdatePartService } from '../../application/services/update-part.service';
import { PartResponseDto } from '../dtos/part-response.dto';

@Controller('parts')
export class PartController {
  constructor(
    private readonly createPart: CreatePartService,
    private readonly updatePart: UpdatePartService,
    private readonly deletePart: DeletePartService,
    private readonly findAllParts: FindAllPartsService,
    private readonly findPartById: FindPartByIdService,
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
}
