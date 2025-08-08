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
import { VehicleResponseDto } from '../../application/dtos/vehicle-response.dto';

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
      return {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        plate: vehicle.plate,
        year: vehicle.year,
        customer: vehicle.customer,
        created_at: vehicle.created_at,
      };
    } catch (error: any) {
      if (error?.message?.includes('Invalid license plate format')) {
        throw new BadRequestException('Invalid license plate format');
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'List of all vehicles', type: [VehicleResponseDto] })
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findService.execute();
    return vehicles.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      customer: vehicle.customer,
      created_at: vehicle.created_at,
    }));
  }

  @Get('plate/:plate')
  @ApiOperation({ summary: 'Find vehicle by license plate' })
  @ApiParam({ name: 'plate', description: 'Vehicle license plate', example: 'ABC-1234' })
  @ApiResponse({ status: 200, description: 'Vehicle found', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findByPlate(@Param('plate') plate: string): Promise<VehicleResponseDto> {
    const vehicle = await this.findByPlateService.execute(plate);
    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      customer: vehicle.customer,
      created_at: vehicle.created_at,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Vehicle found', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findById(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.findByIdService.execute(id);
    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      customer: vehicle.customer,
      created_at: vehicle.created_at,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Vehicle updated', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const updated = await this.updateService.execute(id, dto);
    return {
      id: updated.id,
      brand: updated.brand,
      model: updated.model,
      plate: updated.plate,
      year: updated.year,
      customer: updated.customer,
      created_at: updated.created_at,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', example: '1' })
  @ApiResponse({ status: 204, description: 'Vehicle deleted' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: string): Promise<void> {
    await this.deleteService.execute(id);
  }
}
