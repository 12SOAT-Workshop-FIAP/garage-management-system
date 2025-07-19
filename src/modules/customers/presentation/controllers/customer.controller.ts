import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../../application/dtos/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  @Post()
  create(@Body() _dto: CreateCustomerDto): CustomerResponseDto {
    // TODO: Call service
    return {} as CustomerResponseDto;
  }

  @Get()
  findAll(): CustomerResponseDto[] {
    // TODO: Call service
    return [];
  }

  @Get(':id')
  findOne(@Param('id') _id: string): CustomerResponseDto {
    // TODO: Call service
    return {} as CustomerResponseDto;
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() _dto: UpdateCustomerDto): CustomerResponseDto {
    // TODO: Call service
    return {} as CustomerResponseDto;
  }

  @Delete(':id')
  remove(@Param('id') _id: string): void {
    // TODO: Call service
  }
}
