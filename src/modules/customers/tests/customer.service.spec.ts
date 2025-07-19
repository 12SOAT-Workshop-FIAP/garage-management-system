import { CreateCustomerService } from '../application/services/create-customer.service';
import { CustomerRepository } from '../domain/customer.repository';

describe('CreateCustomerService', () => {
  it('should be defined', () => {
    const mockRepository: CustomerRepository = { findById: jest.fn(), save: jest.fn() };
    expect(new CreateCustomerService(mockRepository)).toBeDefined();
  });
});
