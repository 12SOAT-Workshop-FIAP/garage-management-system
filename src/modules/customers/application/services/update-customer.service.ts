import { Injectable, NotFoundException } from '@nestjs/common';
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

  async execute(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const oldCustomer = await this.customerRepository.findById(id);
    if (!oldCustomer || !oldCustomer.status) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    const updated = await this.customerRepository.update(oldCustomer, updateCustomerDto);
    if (!updated) throw new NotFoundException(`Customer with ID ${id} not found`);
    return updated;
  }
}
