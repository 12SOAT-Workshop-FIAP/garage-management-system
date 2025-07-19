import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateWorkOrderDto } from '../../application/dtos/create-work-order.dto';
import { UpdateWorkOrderDto } from '../../application/dtos/update-work-order.dto';
import { WorkOrderResponseDto } from '../dtos/work-order-response.dto';

@ApiTags('work-orders')
@Controller('work-orders')
export class WorkOrderController {
  @Post()
  create(@Body() _dto: CreateWorkOrderDto): WorkOrderResponseDto {
    // TODO: Call service
    return {} as WorkOrderResponseDto;
  }

  @Get()
  findAll(): WorkOrderResponseDto[] {
    // TODO: Call service
    return [];
  }

  @Get(':id')
  findOne(@Param('id') _id: string): WorkOrderResponseDto {
    // TODO: Call service
    return {} as WorkOrderResponseDto;
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() _dto: UpdateWorkOrderDto): WorkOrderResponseDto {
    // TODO: Call service
    return {} as WorkOrderResponseDto;
  }

  @Delete(':id')
  remove(@Param('id') _id: string): void {
    // TODO: Call service
  }
}
