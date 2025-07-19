import { Customer } from './customer.entity';

/**
 * CustomerRepository
 * Contract for customer persistence operations.
 */
export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
}
