import { CreateCustomerDto } from '../application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../application/dtos/update-customer.dto';
import { Customer } from './customer';

/**
 * CustomerRepository
 * Contract for customer persistence operations.
 */
export abstract class CustomerRepository {
  abstract findAll(): Promise<Customer[] | null>;
  abstract findById(id: number): Promise<Customer | null>;
  abstract create(customer: CreateCustomerDto): Promise<Customer>;
  abstract update(id: number, data: UpdateCustomerDto): Promise<Customer | null>;
  abstract delete(id: number): Promise<void>;
}
