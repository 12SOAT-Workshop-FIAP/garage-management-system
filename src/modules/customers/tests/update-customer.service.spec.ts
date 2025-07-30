import { NotFoundException } from '@nestjs/common';
import { UpdateCustomerService } from '../application/services/update-customer.service';
import { CustomerRepository } from '../domain/customer.repository';
import { Customer } from '../domain/customer';
import { UpdateCustomerDto } from '../application/dtos/update-customer.dto';

describe('UpdateCustomerService', () => {
  let service: UpdateCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
    };
    service = new UpdateCustomerService(mockCustomerRepository);
  });

  it('should update the customer partially (PATCH)', async () => {
    const customer = new Customer({
      id: 1,
      name: 'Maria Oliveira da Silva',
      personType: 'INDIVIDUAL',
      document: '98765432100',
      email: 'maria.oliveira@example.com',
      phone: '+5511976543210',
      createdAt: new Date('2025-07-29T14:00:00Z'),
      updatedAt: new Date('2025-07-29T14:00:00Z'),
      status: true,
    });

    const dto: UpdateCustomerDto = {
      email: 'novo.email@example.com',
      phone: '+5511988889999',
    };

    const updatedCustomer = { ...customer, ...dto, updatedAt: new Date() };

    mockCustomerRepository.findById.mockResolvedValue(customer);
    mockCustomerRepository.update.mockResolvedValue(updatedCustomer);

    const result = await service.execute(customer.id, dto);

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customer.id);
    expect(mockCustomerRepository.update).toHaveBeenCalledWith(customer, dto);

    expect(result.email).toBe(dto.email);
    expect(result.phone).toBe(dto.phone);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw NotFoundException if customer is not found', async () => {
    mockCustomerRepository.findById.mockResolvedValue(null);

    await expect(service.execute(99, { email: 'x@x.com' })).rejects.toThrow(NotFoundException);
    expect(mockCustomerRepository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if customer is inactive', async () => {
    const inactiveCustomer = new Customer({
      id: 1,
      name: 'João',
      personType: 'INDIVIDUAL',
      document: '11111111111',
      email: 'joao@example.com',
      phone: '+5511999999999',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: false,
    });

    mockCustomerRepository.findById.mockResolvedValue(inactiveCustomer);

    await expect(service.execute(inactiveCustomer.id, { phone: '...' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockCustomerRepository.update).not.toHaveBeenCalled();
  });
});
