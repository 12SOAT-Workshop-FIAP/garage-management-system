import { NotFoundException } from '@nestjs/common';
import { DeleteCustomerService } from '../application/services/delete-customer.service';
import { CustomerRepository } from '../domain/customer.repository';
import { Customer } from '../domain/customer';

describe('DeleteCustomerService', () => {
  let deleteCustomerService: DeleteCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    deleteCustomerService = new DeleteCustomerService(mockCustomerRepository);
  });

  it('should delete customer successfully when customer exists', async () => {
    const id = 15;
    const activeCustomer = new Customer({
      id: 2,
      name: 'Maria Oliveira da Silva',
      personType: 'INDIVIDUAL',
      document: '98765432100',
      email: 'maria.oliveira@example.com',
      phone: '+5511976543210',
      createdAt: new Date('2025-07-29T14:34:45.318Z'),
      updatedAt: new Date('2025-07-29T14:36:02.053Z'),
      status: true,
    });

    mockCustomerRepository.findById.mockResolvedValue(activeCustomer);
    mockCustomerRepository.delete.mockResolvedValue(undefined);

    await deleteCustomerService.execute(id);

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockCustomerRepository.delete).toHaveBeenCalledWith(id);
    expect(mockCustomerRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    const id = 15;

    mockCustomerRepository.findById.mockResolvedValue(null);

    await expect(deleteCustomerService.execute(id)).rejects.toThrow(NotFoundException);

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockCustomerRepository.delete).not.toHaveBeenCalled();
  });
});
