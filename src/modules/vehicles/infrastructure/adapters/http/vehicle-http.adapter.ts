import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateVehicleUseCase } from '../../../application/use-cases/create-vehicle.usecase';
import { UpdateVehicleUseCase } from '../../../application/use-cases/update-vehicle.usecase';
import { DeleteVehicleUseCase } from '../../../application/use-cases/delete-vehicle.usecase';
import { FindAllVehiclesUseCase } from '../../../application/use-cases/find-all-vehicles.usecase';
import { FindVehicleByIdUseCase } from '../../../application/use-cases/find-vehicle-by-id.usecase';
import { CreateVehicleDto } from '../../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../../../application/dtos/vehicle-response.dto';
import { DomainError } from '../../../domain/errors/domain-error';

@Controller('vehicles')
@Injectable()
export class VehicleHttpAdapter {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.createVehicleUseCase.execute(createVehicleDto);
      return this.toResponse(vehicle);
    } catch (error) {
      this.mapError(error);
    }
  }

  @Get()
  async findAll(): Promise<VehicleResponseDto[]> {
    try {
      const vehicles = await this.findAllVehiclesUseCase.execute();
      return vehicles.map((vehicle) => this.toResponse(vehicle));
    } catch (error) {
      this.mapError(error);
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.findVehicleByIdUseCase.execute(id);
      return this.toResponse(vehicle);
    } catch (error) {
      this.mapError(error);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    try {
      const vehicle = await this.updateVehicleUseCase.execute({ id, ...updateVehicleDto });
      return this.toResponse(vehicle);
    } catch (error) {
      this.mapError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.deleteVehicleUseCase.execute(id);
    } catch (error) {
      this.mapError(error);
    }
  }

  private toResponse(vehicle: any): VehicleResponseDto {
    return {
      id: vehicle.id?.toString() ?? null,
      plate: vehicle.plate.value,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      customer: { id: vehicle.customerId } as any, // Simplified for now
      created_at: new Date(), // Will be properly set when we have the full entity
    };
  }

  private mapError(error: unknown): never {
    if (error instanceof DomainError) {
      if (
        error.code.includes('NOT_FOUND') ||
        error.code === 'CUSTOMER_NOT_FOUND' ||
        error.code === 'VEHICLE_NOT_FOUND'
      ) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException({ code: error.code, message: error.message });
    }
    throw error;
  }
}
