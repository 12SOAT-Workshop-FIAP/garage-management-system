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
} from '@nestjs/common';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../../application/dtos/response-vehicle.dto'
import { CreateVehicleService } from '../../application/services/create-vehicle.service';
import { FindVehiclesService } from '../../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../../application/services/delete-vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly createService: CreateVehicleService,
    private readonly findService: FindVehiclesService,
    private readonly updateService: UpdateVehicleService,
    private readonly deleteService: DeleteVehicleService,
  ) {}

@Post()
@UsePipes(new ValidationPipe({
  whitelist: true,             // mantém só os campos do DTO
  forbidNonWhitelisted: false, // desmonta o erro de “property should not exist”
}))
async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
  console.log('🍀 DTO recebida:', dto);  // <— aqui!
  const vehicle = await this.createService.execute(dto);
  return new VehicleResponseDto(vehicle);
}

  @Get()
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findService.execute();
    return vehicles.map(vehicle => new VehicleResponseDto(vehicle));
  }

  @Put(':id')
  //@UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const updated = await this.updateService.execute(id, dto);
    return new VehicleResponseDto(updated);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteService.execute(id);
  }
}
