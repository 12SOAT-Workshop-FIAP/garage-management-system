import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';
import { FindAllVehicleService } from '@modules/vehicles/application/services/find-all-vehicle.service';
import { CreateVehicleService } from '@modules/vehicles/application/services/create-vehicle.service';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private findAllVehicleService: FindAllVehicleService,
    private createVehicleService: CreateVehicleService,
  ) {}

  @Get()
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicle = await this.findAllVehicleService.execute();
    return vehicle;
  }

  @Get(':id')
  findOne(@Param('id') _id: string): VehicleResponseDto {
    // TODO: Call service
    return {} as VehicleResponseDto;
  }

  @Post()
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.createVehicleService.execute(dto);
    return vehicle;
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() _dto: UpdateVehicleDto): VehicleResponseDto {
    // TODO: Call service
    return {} as VehicleResponseDto;
  }

  @Delete(':id')
  remove(@Param('id') _id: string): void {
    // TODO: Call service
  }
}
