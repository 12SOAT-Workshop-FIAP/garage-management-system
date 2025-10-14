import { CustomerReaderPort, CustomerData } from '../../domain/ports/customer-reader.port';
import { CustomerRepository } from '@modules/customers/domain/repositories/customer.repository';

export class CustomerReaderAdapter implements CustomerReaderPort {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async findById(customerId: number): Promise<CustomerData | null> {
    try {
      const customer = await this.customerRepository.findById(customerId);

      if (!customer) {
        return null;
      }

      // 🔄 Transform domain entity to port interface
      return {
        id: customer.id?.toString() || customerId.toString(),
        name: customer.name.value,
        email: customer.email?.value || '',
      };
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      return null;
    }
  }
}
