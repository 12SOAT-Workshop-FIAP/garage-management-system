import { FindAllServicesService } from '../application/services/find-all-services.service';
import { ServiceRepository } from '../domain/service.repository';
import { Service } from '../domain/service.entity';

describe('FindAllServicesService', () => {
  let findAllServicesService: FindAllServicesService;
  let mockServiceRepository: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServiceRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    findAllServicesService = new FindAllServicesService(mockServiceRepository);
  });

  it('should return all services when services exist', async () => {
    const mockServices = [
      new Service(
        {
          name: 'Oil Change',
          description: 'Complete oil change service',
          price: 50.0,
          active: true,
          duration: 30,
        },
        'id-1',
      ),
      new Service(
        {
          name: 'Brake Inspection',
          description: 'Complete brake system inspection',
          price: 25.0,
          active: true,
          duration: 15,
        },
        'id-2',
      ),
      new Service(
        {
          name: 'Tire Rotation',
          description: 'Rotate all four tires',
          price: 35.0,
          active: false,
          duration: 20,
        },
        'id-3',
      ),
    ];

    mockServiceRepository.findAll.mockResolvedValue(mockServices);

    const result = await findAllServicesService.execute();

    expect(result).toEqual(mockServices);
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(Service);
    expect(result[0].name).toBe('Oil Change');
    expect(result[1].name).toBe('Brake Inspection');
    expect(result[2].name).toBe('Tire Rotation');
    expect(mockServiceRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no services exist', async () => {
    mockServiceRepository.findAll.mockResolvedValue([]);

    const result = await findAllServicesService.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(mockServiceRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
