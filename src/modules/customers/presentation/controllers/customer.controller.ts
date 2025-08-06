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
import { ApiTags } from '@nestjs/swagger';
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
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.findAllCustomerService.execute();
    return customers ? customers.map((customer) => new CustomerResponseDto({ ...customer })) : [];
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  ): Promise<CustomerResponseDto | null> {
    const customer = await this.findOneCustomerService.execute(id);
    return new CustomerResponseDto({ ...customer });
  }

  @Get('document/:document')
  async findByDocument(@Param('document') document: string): Promise<CustomerResponseDto | null> {
    const customer = await this.findByDocumentCustomerService.execute(document);
    return new CustomerResponseDto({ ...customer });
  }

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerService.execute(dto);
    return new CustomerResponseDto({ ...customer });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.updateCustomerService.execute(id, dto);
    return new CustomerResponseDto({ ...customer });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteCustomerService.execute(id);
  }
}
