import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { FindAllCustomerService } from '@modules/customers/application/services/find-all-customer.service';
import { CreateCustomerService } from '@modules/customers/application/services/create-customer.service';
import { FindOneCustomerService } from '@modules/customers/application/services/find-one-customer.sevice';
import { UpdateCustomerService } from '@modules/customers/application/services/update-customer.service';
import { DeleteCustomerService } from '@modules/customers/application/services/delete-customer.service';
import { CreateCustomerDto } from '@modules/customers/application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '@modules/customers/application/dtos/update-customer.dto';
import { FindByDocumentCustomerService } from '@modules/customers/application/services/find-by-document-customer.service';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private findAllCustomerService: FindAllCustomerService,
    private findOneCustomerService: FindOneCustomerService,
    private findByDocumentCustomerService: FindByDocumentCustomerService,
    private createCustomerService: CreateCustomerService,
    private updateCustomerService: UpdateCustomerService,
    private deleteCustomerService: DeleteCustomerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customers retrieved successfully', type: [CustomerResponseDto] })
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.findAllCustomerService.execute();
    return customers ? customers.map((customer) => new CustomerResponseDto({ ...customer })) : [];
  }

  @Get('document/:document')
  @ApiOperation({ summary: 'Find customer by CPF or CNPJ' })
  @ApiParam({ 
    name: 'document', 
    description: 'CPF (11 digits) or CNPJ (14 digits). Can include formatting like 123.456.789-00',
    example: '12345678900'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer found', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid CPF or CNPJ format' })
  async findByDocument(@Param('document') document: string): Promise<CustomerResponseDto | null> {
    const customer = await this.findByDocumentCustomerService.execute(document);
    return new CustomerResponseDto({ ...customer });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer found', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async findById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  ): Promise<CustomerResponseDto | null> {
    const customer = await this.findOneCustomerService.execute(id);
    return new CustomerResponseDto({ ...customer });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Customer created successfully', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerService.execute(dto);
    return new CustomerResponseDto({ ...customer });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer updated successfully', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.updateCustomerService.execute(id, dto);
    return new CustomerResponseDto({ ...customer });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Customer deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteCustomerService.execute(id);
  }
}
