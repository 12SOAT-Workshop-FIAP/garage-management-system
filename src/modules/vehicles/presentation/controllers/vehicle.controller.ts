import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';
import { FindAllVehicleService } from '@modules/vehicles/application/services/find-all-vehicle.service';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private findAllvehicleService: FindAllVehicleService) {}

  @Post()
  create(@Body() _dto: CreateVehicleDto): VehicleResponseDto {
    // TODO: Call service
    return {} as VehicleResponseDto;
  }

  @Get()
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicle = await this.findAllvehicleService.execute();
    return vehicle;
  }

  @Get(':id')
  findOne(@Param('id') _id: string): VehicleResponseDto {
    // TODO: Call service
    return {} as VehicleResponseDto;
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
