import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../../application/dtos/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { FindAllCustomerService } from '@modules/customers/application/services/find-all-customer.service';
import { CreateCustomerService } from '@modules/customers/application/services/create-customer.service';
import { FindOneCustomerService } from '@modules/customers/application/services/find-one-customer.sevice';
import { UpdateCustomerService } from '@modules/customers/application/services/update-customer.service';
import { DeleteCustomerService } from '@modules/customers/application/services/delete-customer.service';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private findAllCustomerService: FindAllCustomerService,
    private findeOneCustomerService: FindOneCustomerService,
    private createCustomerService: CreateCustomerService,
    private updateCustomerService: UpdateCustomerService,
    private deleteCustomerService: DeleteCustomerService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customer = await this.findAllCustomerService.execute();
    return customer ?? [];
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<CustomerResponseDto> {
    const customer = await this.findeOneCustomerService.execute(id);
    return customer ?? ({} as CustomerResponseDto);
  }

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerService.execute(dto);
    return customer;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.updateCustomerService.execute(id, dto);
    return customer ?? ({} as CustomerResponseDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteCustomerService.execute(id);
  }
}
