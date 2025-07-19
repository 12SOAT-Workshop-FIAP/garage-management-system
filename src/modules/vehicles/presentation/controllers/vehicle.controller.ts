import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  @Post()
  create(@Body() _dto: CreateVehicleDto): VehicleResponseDto {
    // TODO: Call service
    return {} as VehicleResponseDto;
  }

  @Get()
  findAll(): VehicleResponseDto[] {
    // TODO: Call service
    return [];
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
