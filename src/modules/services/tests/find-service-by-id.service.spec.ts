import { NotFoundException } from '@nestjs/common';
import { FindServiceByIdService } from '../application/services/find-service-by-id.service';
import { ServiceRepository } from '../domain/service.repository';
import { Service } from '../domain/service.entity';

describe('FindServiceByIdService', () => {
  let findServiceByIdService: FindServiceByIdService;
  let mockServiceRepository: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServiceRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    findServiceByIdService = new FindServiceByIdService(mockServiceRepository);
  });

  it('should return service when service exists', async () => {
    const serviceId = 'test-id';
    const existingService = new Service(
      {
        name: 'Test Service',
        description: 'Test Description',
        price: 50.0,
        active: true,
        duration: 30,
      },
      serviceId,
    );

    mockServiceRepository.findById.mockResolvedValue(existingService);

    const result = await findServiceByIdService.execute(serviceId);

    expect(result).toEqual(existingService);
    expect(result.id).toBe(serviceId);
    expect(result.name).toBe('Test Service');
    expect(result.description).toBe('Test Description');
    expect(result.price).toBe(50.0);
    expect(result.active).toBe(true);
    expect(result.duration).toBe(30);
    expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    const serviceId = 'non-existent-id';

    mockServiceRepository.findById.mockResolvedValue(null);

    await expect(findServiceByIdService.execute(serviceId)).rejects.toThrow(NotFoundException);
    await expect(findServiceByIdService.execute(serviceId)).rejects.toThrow('Service not found');

    expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.findById).toHaveBeenCalledTimes(2);
  });
});
