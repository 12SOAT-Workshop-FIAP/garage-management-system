import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

/**
 * CreateCustomerService (Serviço de criação de Cliente)
 * Application service for creating a customer (Cliente).
 */
@Injectable()
export class CreateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(_dto: CreateCustomerDto) {
    // TODO: Implement customer creation logic
    return null;
  }
}
