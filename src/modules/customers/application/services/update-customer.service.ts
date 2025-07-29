import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

/**
 * UpdateCustomerService (Serviço de atualização de Cliente)
 * Application service for updating a customer (Cliente).
 */
@Injectable()
export class UpdateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer | null> {
    return await this.customerRepository.update(id, updateCustomerDto);
  }
}
