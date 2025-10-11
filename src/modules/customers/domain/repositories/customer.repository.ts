import { Customer } from '../entities/customer.entity';

export abstract class CustomerRepository {
  abstract findAll(): Promise<Customer[] | null>;
  abstract findById(id: number): Promise<Customer | null>;
  abstract findByDocument(document: string): Promise<Customer | null>;
  abstract create(customer: Customer): Promise<Customer>;
  abstract update(oldCustomer: Customer, newCustomer: Customer): Promise<Customer | null>;
  abstract delete(customer: Customer): Promise<void>;
}
