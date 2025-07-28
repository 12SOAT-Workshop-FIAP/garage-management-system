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
  ParseUUIDPipe,      // <— importe aqui
} from '@nestjs/common';
import { CreateVehicleDto } from '@modules/vehicles/application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '@modules/vehicles/application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '@modules/vehicles/application/dtos/response-vehicle.dto';
import { CreateVehicleService } from '@modules/vehicles/application/services/create-vehicle.service';
import { FindVehiclesService } from '@modules/vehicles/application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '@modules/vehicles/application/services/update-vehicle.service';
import { DeleteVehicleService } from '@modules/vehicles/application/services/delete-vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly createService: CreateVehicleService,
    private readonly findService: FindVehiclesService,
    private readonly updateService: UpdateVehicleService,
    private readonly deleteService: DeleteVehicleService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.createService.execute(dto);
    return new VehicleResponseDto(vehicle);
  }

  @Get()
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findService.execute();
    return vehicles.map(v => new VehicleResponseDto(v));
  }

 @Put(':id')
async update(
  @Param('id', new ParseUUIDPipe()) id: string,  // <-- string + ParseUUIDPipe
  @Body() dto: UpdateVehicleDto,
): Promise<VehicleResponseDto> {
  const updated = await this.updateService.execute(id, dto);
  return new VehicleResponseDto(updated);
}

@Delete(':id')
@HttpCode(204)
async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
  await this.deleteService.execute(id);
}
}