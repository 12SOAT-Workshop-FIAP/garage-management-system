import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  BadRequestException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { CreateVehicleUseCase } from '../../application/use-cases/create-vehicle.usecase';
import { UpdateVehicleUseCase } from '../../application/use-cases/update-vehicle.usecase';
import { FindVehicleByIdUseCase } from '../../application/use-cases/find-vehicle-by-id.usecase';
import { FindAllVehiclesUseCase } from '../../application/use-cases/find-all-vehicles.usecase';
import { DeleteVehicleUseCase } from '../../application/use-cases/delete-vehicle.usecase';
import { Vehicle } from '../../domain/entities/vehicle';
import { DomainError } from '../../domain/errors/domain-error';

class VehicleResponse {
  id!: number | null; // na criação pode ser null se o repo não retornar o id
  plate!: string;
  brand!: string;
  model!: string;
  year!: number;
  customerId!: number;
  color!: string | null | undefined;
}

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicle: CreateVehicleUseCase,
    private readonly updateVehicle: UpdateVehicleUseCase,
    private readonly findById: FindVehicleByIdUseCase,
    private readonly findAll: FindAllVehiclesUseCase,
    private readonly deleteVehicle: DeleteVehicleUseCase,
  ) {}

  private toResponse(v: Vehicle): VehicleResponse {
    return {
      id: v.id ?? null,
      plate: v.plate.value,
      brand: v.brand,
      model: v.model,
      year: v.year,
      customerId: v.customerId,
      color: v.color ?? null,
    };
  }

  private mapError(e: unknown): never {
    if (e instanceof DomainError) {
      if (e.code.includes('NOT_FOUND')) throw new NotFoundException(e.message);
      throw new BadRequestException({ code: e.code, message: e.message });
    }
    throw e;
  }

  @Post()
  @ApiOperation({ summary: 'Create vehicle' })
  @ApiCreatedResponse({ type: VehicleResponse })
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponse> {
    try {
      const vehicle = await this.createVehicle.execute(dto);
      return this.toResponse(vehicle);
    } catch (e) {
      this.mapError(e);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List vehicles (desc by creation)' })
  @ApiOkResponse({ type: VehicleResponse, isArray: true })
  async list(): Promise<VehicleResponse[]> {
    try {
      const items = await this.findAll.execute();
      return items.map((v) => this.toResponse(v));
    } catch (e) {
      this.mapError(e);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find vehicle by id' })
  @ApiOkResponse({ type: VehicleResponse })
  async get(@Param('id', ParseIntPipe) id: number): Promise<VehicleResponse> {
    try {
      const v = await this.findById.execute(id);
      return this.toResponse(v);
    } catch (e) {
      this.mapError(e);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiOkResponse({ type: VehicleResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponse> {
    try {
      const v = await this.updateVehicle.execute({ id, ...dto });
      return this.toResponse(v);
    } catch (e) {
      this.mapError(e);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  @HttpCode(204)
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.deleteVehicle.execute(id);
    } catch (e) {
      this.mapError(e);
    }
  }
}
