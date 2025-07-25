import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CUSTOMER_REPOSITORY } from '@modules/customers/infrastructure/repositories/customer.typeorm.repository';

/**
 * CreateCustomerService (Serviço de criação de Cliente)
 * Application service for creating a customer (Cliente).
 */
@Injectable()
export class CreateCustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(_dto: CreateCustomerDto) {
    // TODO: Implement customer creation logic
    return null;
  }
}
