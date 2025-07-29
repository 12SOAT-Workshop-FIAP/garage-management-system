import { FindAllCustomerService } from '../application/services/find-all-customer.service';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';

describe('FindAllCustomersService', () => {
  let findAllCustomerService: FindAllCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    findAllCustomerService = new FindAllCustomerService(mockCustomerRepository);
  });

  it('should be defined', () => {
    expect(findAllCustomerService).toBeDefined();
  });

  it('should return all customers that exists', async () => {
    const mockCustomers = [
      new Customer({
        id: 2,
        name: 'Maria Oliveira da Silva',
        personType: 'INDIVIDUAL',
        document: '98765432100',
        email: 'maria.oliveira@example.com',
        phone: '+5511976543210',
        createdAt: new Date('2025-07-29T14:34:45.318Z'),
        updatedAt: new Date('2025-07-29T14:36:02.053Z'),
        status: false,
      }),
      new Customer({
        id: 3,
        name: 'João Pedro Andrade',
        personType: 'INDIVIDUAL',
        document: '12312312399',
        email: 'joao.pedro@example.com',
        phone: '+5511987654321',
        createdAt: new Date('2025-07-29T15:10:00.000Z'),
        updatedAt: new Date('2025-07-29T15:20:00.000Z'),
        status: true,
      }),

      new Customer({
        id: 4,
        name: 'Oficina Mecânica Ltda',
        personType: 'COMPANY',
        document: '55667788000144',
        email: 'contato@oficinamecanica.com',
        phone: '+551130304050',
        createdAt: new Date('2025-07-29T13:45:00.000Z'),
        updatedAt: new Date('2025-07-29T14:00:00.000Z'),
        status: true,
      }),
    ];

    mockCustomerRepository.findAll.mockResolvedValue(mockCustomers);

    const result = await findAllCustomerService.execute();

    if (!result) {
      fail('Expected customers array, but got null');
    }

    expect(result).toEqual(mockCustomers);
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(Customer);
    expect(result[0].document).toBe('98765432100');
    expect(result[1].document).toBe('12312312399');
    expect(result[2].document).toBe('55667788000144');
    expect(mockCustomerRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no found customers', async () => {
    mockCustomerRepository.findAll.mockResolvedValue([]);

    const result = await findAllCustomerService.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(mockCustomerRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
