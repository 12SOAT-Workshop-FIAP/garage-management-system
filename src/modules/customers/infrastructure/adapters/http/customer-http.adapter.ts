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
import { CreateCustomerRequestDto } from './dtos/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dtos/update-customer-request.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { CreateCustomerCommand } from '../../../application/commands/create-customer.command';
import { UpdateCustomerCommand } from '../../../application/commands/update-customer.command';
import { DeleteCustomerCommand } from '../../../application/commands/delete-customer.command';
import { FindCustomerByIdQuery } from '../../../application/queries/find-customer-by-id.query';
import { FindCustomerByDocumentQuery } from '../../../application/queries/find-customer-by-document.query';
import { FindAllCustomersQuery } from '../../../application/queries/find-all-customers.query';
import { CreateCustomerUseCase } from '../../../application/use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../../application/use-cases/delete-customer.use-case';
import { FindCustomerByIdUseCase } from '../../../application/use-cases/find-customer-by-id.use-case';
import { FindCustomerByDocumentUseCase } from '../../../application/use-cases/find-customer-by-document.use-case';
import { FindAllCustomersUseCase } from '../../../application/use-cases/find-all-customers.use-case';

@ApiTags('customers')
@Controller('customers')
export class CustomerHttpAdapter {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase,
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customers retrieved successfully',
    type: [CustomerResponseDto],
  })
  async findAll(): Promise<CustomerResponseDto[]> {
    const query = new FindAllCustomersQuery();
    const customers = await this.findAllCustomersUseCase.execute(query);
    return customers.map((customer: any) => new CustomerResponseDto(customer));
  }

  @Get('document/:document')
  @ApiOperation({ summary: 'Find customer by CPF or CNPJ' })
  @ApiParam({
    name: 'document',
    description: 'CPF (11 digits) or CNPJ (14 digits). Can include formatting like 123.456.789-00',
    example: '12345678900',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer found', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid CPF or CNPJ format' })
  async findByDocument(@Param('document') document: string): Promise<CustomerResponseDto> {
    const query = new FindCustomerByDocumentQuery(document);
    const customer = await this.findCustomerByDocumentUseCase.execute(query);
    return new CustomerResponseDto(customer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer found', type: CustomerResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async findById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  ): Promise<CustomerResponseDto> {
    const query = new FindCustomerByIdQuery(id);
    const customer = await this.findCustomerByIdUseCase.execute(query);
    return new CustomerResponseDto(customer);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() dto: CreateCustomerRequestDto): Promise<CustomerResponseDto> {
    const command = new CreateCustomerCommand(
      dto.name,
      dto.personType,
      dto.document,
      dto.phone,
      dto.email,
    );
    const customer = await this.createCustomerUseCase.execute(command);
    return new CustomerResponseDto(customer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    const command = new UpdateCustomerCommand(
      id,
      dto.name,
      dto.personType,
      dto.document,
      dto.phone,
      dto.email,
      dto.status,
    );
    const customer = await this.updateCustomerUseCase.execute(command);
    return new CustomerResponseDto(customer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Customer deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    const command = new DeleteCustomerCommand(id);
    await this.deleteCustomerUseCase.execute(command);
  }
}
