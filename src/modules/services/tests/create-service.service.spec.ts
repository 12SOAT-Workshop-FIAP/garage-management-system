import { CreateServiceService } from '../application/services/create-service.service';
import { ServiceRepository } from '../domain/service.repository';
import { Service } from '../domain/service.entity';
import { CreateServiceDto } from '../application/dtos/create-service.dto';

describe('CreateServiceService', () => {
  let createServiceService: CreateServiceService;
  let mockServiceRepository: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServiceRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    createServiceService = new CreateServiceService(mockServiceRepository);
  });

  it('should create a new service successfully', async () => {
    const createServiceDto: CreateServiceDto = {
      name: 'Oil Change',
      description: 'Complete oil change service',
      price: 50.99,
      active: true,
      duration: 30,
    };

    mockServiceRepository.create.mockResolvedValue(undefined);

    const result = await createServiceService.execute(createServiceDto);

    expect(result).toBeInstanceOf(Service);
    expect(result.name).toBe(createServiceDto.name);
    expect(result.description).toBe(createServiceDto.description);
    expect(result.price).toBe(createServiceDto.price);
    expect(result.active).toBe(createServiceDto.active);
    expect(result.duration).toBe(createServiceDto.duration);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(mockServiceRepository.create).toHaveBeenCalledWith(result);
    expect(mockServiceRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle repository errors', async () => {
    const createServiceDto: CreateServiceDto = {
      name: 'Test Service',
      description: 'Test Description',
      price: 100.0,
      active: true,
      duration: 60,
    };

    const repositoryError = new Error('Database connection failed');
    mockServiceRepository.create.mockRejectedValue(repositoryError);

    await expect(createServiceService.execute(createServiceDto)).rejects.toThrow(
      'Database connection failed',
    );
  });
});
