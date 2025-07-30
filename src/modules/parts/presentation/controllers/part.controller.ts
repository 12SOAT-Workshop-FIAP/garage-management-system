import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  ParseUUIDPipe,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { CreatePartDto } from '../../application/dtos/create-part.dto';
import { UpdatePartDto, UpdateStockDto } from '../../application/dtos/update-part.dto';
import { PartResponseDto, PartStockStatusDto } from '../dtos/part-response.dto';

import { CreatePartService } from '../../application/services/create-part.service';
import { FindPartByIdService } from '../../application/services/find-part-by-id.service';
import { FindAllPartsService } from '../../application/services/find-all-parts.service';
import { UpdatePartService } from '../../application/services/update-part.service';
import { DeletePartService } from '../../application/services/delete-part.service';
import { UpdateStockService } from '../../application/services/update-stock.service';

/**
 * PartController (Controlador de Peças/Insumos)
 * REST API controller for managing parts and supplies.
 */
@ApiTags('Parts')
@Controller('parts')
export class PartController {
  constructor(
    private readonly createPartService: CreatePartService,
    private readonly findPartByIdService: FindPartByIdService,
    private readonly findAllPartsService: FindAllPartsService,
    private readonly updatePartService: UpdatePartService,
    private readonly deletePartService: DeletePartService,
    private readonly updateStockService: UpdateStockService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new part',
    description: 'Creates a new part or supply item in the system'
  })
  @ApiBody({ type: CreatePartDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Part created successfully',
    type: PartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Part number already exists',
  })
  async createPart(@Body() createPartDto: CreatePartDto): Promise<PartResponseDto> {
    const part = await this.createPartService.execute(createPartDto);
    return PartResponseDto.fromEntity(part);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all parts',
    description: 'Retrieves all parts with optional filtering'
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'lowStock', required: false, type: Boolean, description: 'Filter parts with low stock' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name (partial match)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Parts retrieved successfully',
    type: [PartResponseDto],
  })
  async findAllParts(
    @Query('category') category?: string,
    @Query('active', new DefaultValuePipe(undefined), ParseBoolPipe) active?: boolean,
    @Query('lowStock', new DefaultValuePipe(false), ParseBoolPipe) lowStock?: boolean,
    @Query('name') name?: string,
  ): Promise<PartResponseDto[]> {
    const filters = { category, active, lowStock, name };
    const parts = await this.findAllPartsService.execute(filters);
    return PartResponseDto.fromEntities(parts);
  }

  @Get('low-stock')
  @ApiOperation({ 
    summary: 'Get parts with low stock',
    description: 'Retrieves all parts that have stock below minimum level'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock parts retrieved successfully',
    type: [PartResponseDto],
  })
  async findLowStockParts(): Promise<PartResponseDto[]> {
    const parts = await this.findAllPartsService.findLowStock();
    return PartResponseDto.fromEntities(parts);
  }

  @Get('category/:category')
  @ApiOperation({ 
    summary: 'Get parts by category',
    description: 'Retrieves all active parts in a specific category'
  })
  @ApiParam({ name: 'category', description: 'Part category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Parts retrieved successfully',
    type: [PartResponseDto],
  })
  async findPartsByCategory(@Param('category') category: string): Promise<PartResponseDto[]> {
    const parts = await this.findAllPartsService.findByCategory(category);
    return PartResponseDto.fromEntities(parts);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get part by ID',
    description: 'Retrieves a specific part by its ID'
  })
  @ApiParam({ name: 'id', description: 'Part ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Part retrieved successfully',
    type: PartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Part not found',
  })
  async findPartById(@Param('id', ParseUUIDPipe) id: string): Promise<PartResponseDto> {
    const part = await this.findPartByIdService.execute(id);
    return PartResponseDto.fromEntity(part);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update part',
    description: 'Updates an existing part information'
  })
  @ApiParam({ name: 'id', description: 'Part ID (UUID)' })
  @ApiBody({ type: UpdatePartDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Part updated successfully',
    type: PartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Part not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Part number already exists',
  })
  async updatePart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    const part = await this.updatePartService.execute(id, updatePartDto);
    return PartResponseDto.fromEntity(part);
  }

  @Put(':id/stock')
  @ApiOperation({ 
    summary: 'Update part stock',
    description: 'Updates the stock quantity of a part'
  })
  @ApiParam({ name: 'id', description: 'Part ID (UUID)' })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Part stock updated successfully',
    type: PartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Part not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid stock operation',
  })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<PartResponseDto> {
    const part = await this.updateStockService.execute(id, updateStockDto);
    return PartResponseDto.fromEntity(part);
  }

  @Get(':id/stock-status')
  @ApiOperation({ 
    summary: 'Check part stock status',
    description: 'Checks if a part has enough stock for a given quantity'
  })
  @ApiParam({ name: 'id', description: 'Part ID (UUID)' })
  @ApiQuery({ name: 'quantity', required: false, type: Number, description: 'Required quantity to check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock status retrieved successfully',
    type: PartStockStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Part not found',
  })
  async checkStockStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity') quantity?: number,
  ): Promise<PartStockStatusDto> {
    const part = await this.findPartByIdService.execute(id);
    return PartStockStatusDto.fromEntity(part, quantity);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete part',
    description: 'Deletes a part from the system'
  })
  @ApiParam({ name: 'id', description: 'Part ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Part deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Part not found',
  })
  async deletePart(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deletePartService.execute(id);
  }
}
