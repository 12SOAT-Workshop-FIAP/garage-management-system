import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  ParseIntPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Importação dos serviços
import { CreateVehicleService } from '../../application/services/create-vehicle.service';
import { FindAllVehicleService } from '../../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../../application/services/delete-vehicle.service';
import { FindByIdVehicleService } from '../../application/services/find-by-id-vehicle.service'; 
import { FindVehicleByPlateService } from '../../application/services/find-vehicle-by-plate.service';

// Importação dos DTOs
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly createService: CreateVehicleService,
    private readonly findService: FindAllVehicleService,
    private readonly findByIdService: FindByIdVehicleService,
    private readonly findByPlateService: FindVehicleByPlateService,
    private readonly updateService: UpdateVehicleService,
    private readonly deleteService: DeleteVehicleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle successfully registered', type: VehicleResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'License plate already exists' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.createService.execute(dto);
      return new VehicleResponseDto(vehicle);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid license plate')) {
        throw new BadRequestException('Invalid license plate format');
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiResponse({ status: 200, description: 'List of vehicles', type: [VehicleResponseDto] })
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findService.execute();
    return vehicles.map(vehicle => new VehicleResponseDto(vehicle));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle found', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<VehicleResponseDto> {
    const vehicle = await this.findByIdService.execute(id);
    return new VehicleResponseDto(vehicle);
  }

  @Get('plate/:plate')
  @ApiOperation({ summary: 'Get vehicle by license plate' })
  @ApiParam({ name: 'plate', type: 'string', description: 'Vehicle license plate' })
  @ApiResponse({ status: 200, description: 'Vehicle found', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findByPlate(@Param('plate') plate: string): Promise<VehicleResponseDto> {
    const vehicle = await this.findByPlateService.execute(plate);
    return new VehicleResponseDto(vehicle);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle updated', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.updateService.execute(id, dto);
    return new VehicleResponseDto(vehicle);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 204, description: 'Vehicle deleted' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteService.execute(id);
  }
}