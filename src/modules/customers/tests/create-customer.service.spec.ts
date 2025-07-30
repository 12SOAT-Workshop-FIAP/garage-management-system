import { CreateCustomerDto } from '../application/dtos/create-customer.dto';
import { CreateCustomerService } from '../application/services/create-customer.service';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';
import { CustomerResponseDto } from '../presentation/dtos/customer-response.dto';

describe('CreateCustomerService', () => {
  let createCustomerService: CreateCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    createCustomerService = new CreateCustomerService(mockCustomerRepository);
  });

  it('should create a new customer successfully', async () => {
    const createCustomereDto: CreateCustomerDto = {
      name: 'Maria Oliveira da Silva',
      personType: 'INDIVIDUAL',
      document: '98765432100',
      email: 'maria.oliveira@example.com',
      phone: '+5511976543210',
      status: true,
    };

    const createdCustomer = new Customer({
      id: 1,
      name: createCustomereDto.name,
      personType: createCustomereDto.personType,
      document: createCustomereDto.document,
      email: createCustomereDto.email,
      phone: createCustomereDto.phone,
      createdAt: new Date('2025-07-29T14:34:45.318Z'),
      updatedAt: new Date('2025-07-29T14:34:45.318Z'),
      status: true,
    });

    mockCustomerRepository.create.mockResolvedValue(createdCustomer);

    const result = await createCustomerService.execute(createCustomereDto);

    expect(result).toBeInstanceOf(Customer);
    expect(result.name).toBe(createCustomereDto.name);
    expect(result.personType).toBe(createCustomereDto.personType);
    expect(result.document).toBe(createCustomereDto.document);
    expect(result.email).toBe(createCustomereDto.email);
    expect(result.phone).toBe(createCustomereDto.phone);
    expect(result.status).toBe(createCustomereDto.status);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(mockCustomerRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createCustomereDto.name,
        personType: createCustomereDto.personType,
        document: createCustomereDto.document,
        email: createCustomereDto.email,
        phone: createCustomereDto.phone,
        status: true,
      }),
    );
    expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);
  });
});
