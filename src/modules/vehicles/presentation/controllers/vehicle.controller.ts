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
  ParseUUIDPipe, // Importado para validar UUIDs no ID do veículo
} from '@nestjs/common';

// Importação dos serviços
import { CreateVehicleService } from '../../application/services/create-vehicle.service';
import { FindAllVehicleService } from '../../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../../application/services/delete-vehicle.service';
import { FindByIdVehicleService } from '../../application/services/find-by-id-vehicle.service'; 

// Importação dos DTOs
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly createService: CreateVehicleService,
    private readonly findService: FindAllVehicleService, 
    private readonly findByIdService: FindByIdVehicleService,
    private readonly updateService: UpdateVehicleService,
    private readonly deleteService: DeleteVehicleService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.createService.execute(dto);
    return new VehicleResponseDto(vehicle);
  }

  @Get() // Endpoint para buscar TODOS os veículos
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findService.execute();
    return vehicles.map(v => new VehicleResponseDto(v));
  }

  @Get(':id') // Para buscar um veículo por ID
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string, // Garante que o ID da URL é um UUID válido
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.findByIdService.execute(id);
    return new VehicleResponseDto(vehicle);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Adiciona o ValidationPipe para o PUT 
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const updated = await this.updateService.execute(id, dto);
    return new VehicleResponseDto(updated);
  }

  @Delete(':id')
  @HttpCode(204) // Retorna 204 No Content para deleções bem-sucedidas
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteService.execute(id);
  }
}