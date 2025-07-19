import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateServiceRequestDto } from '../../application/dtos/create-service-request.dto';
import { UpdateServiceRequestDto } from '../../application/dtos/update-service-request.dto';
import { ServiceRequestResponseDto } from '../dtos/service-request-response.dto';

@ApiTags('service-requests')
@Controller('service-requests')
export class ServiceRequestController {
  @Post()
  create(@Body() _dto: CreateServiceRequestDto): ServiceRequestResponseDto {
    // TODO: Call service
    return {} as ServiceRequestResponseDto;
  }

  @Get()
  findAll(): ServiceRequestResponseDto[] {
    // TODO: Call service
    return [];
  }

  @Get(':id')
  findOne(@Param('id') _id: string): ServiceRequestResponseDto {
    // TODO: Call service
    return {} as ServiceRequestResponseDto;
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _dto: UpdateServiceRequestDto,
  ): ServiceRequestResponseDto {
    // TODO: Call service
    return {} as ServiceRequestResponseDto;
  }

  @Delete(':id')
  remove(@Param('id') _id: string): void {
    // TODO: Call service
  }
}
