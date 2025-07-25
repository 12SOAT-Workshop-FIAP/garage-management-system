import { NotFoundException } from '@nestjs/common';
import { DeleteServiceService } from '../application/services/delete-service.service';
import { ServiceRepository } from '../domain/service.repository';
import { Service } from '../domain/service.entity';

describe('DeleteServiceService', () => {
  let deleteServiceService: DeleteServiceService;
  let mockServiceRepository: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServiceRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    deleteServiceService = new DeleteServiceService(mockServiceRepository);
  });

  it('should delete service successfully when service exists', async () => {
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
    mockServiceRepository.delete.mockResolvedValue(undefined);

    await deleteServiceService.execute(serviceId);

    expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.delete).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    const serviceId = 'non-existent-id';

    mockServiceRepository.findById.mockResolvedValue(null);

    await expect(deleteServiceService.execute(serviceId)).rejects.toThrow(NotFoundException);
    await expect(deleteServiceService.execute(serviceId)).rejects.toThrow('Service not found');

    expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.delete).not.toHaveBeenCalled();
  });
});
