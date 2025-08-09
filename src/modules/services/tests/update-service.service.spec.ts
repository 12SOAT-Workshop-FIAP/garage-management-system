import { NotFoundException } from '@nestjs/common';
import { UpdateServiceService } from '../application/services/update-service.service';
import { ServiceRepository } from '../domain/service.repository';
import { Service } from '../domain/service.entity';
import { UpdateServiceDto } from '../application/dtos/update-service.dto';

describe('UpdateServiceService', () => {
  let updateServiceService: UpdateServiceService;
  let mockServiceRepository: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    mockServiceRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    updateServiceService = new UpdateServiceService(mockServiceRepository);
  });

  it('should update service successfully', async () => {
    const serviceId = 'test-id';
    const existingService = new Service(
      {
        name: 'Original Name',
        description: 'Original Description',
        price: 50.0,
        active: true,
        duration: 30,
      },
      serviceId,
    );

    const updateServiceDto: UpdateServiceDto = {
      name: 'Completely New Name',
      description: 'Completely New Description',
      price: 100.0,
      active: false,
      duration: 60,
    };

    mockServiceRepository.findById.mockResolvedValue(existingService);
    mockServiceRepository.update.mockResolvedValue(undefined);

    const result = await updateServiceService.execute(serviceId, updateServiceDto);

    expect(result.name).toBe('Completely New Name');
    expect(result.description).toBe('Completely New Description');
    expect(result.price).toBe(100.0);
    expect(result.active).toBe(false);
    expect(result.duration).toBe(60);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    const serviceId = 'non-existent-id';
    const updateServiceDto: UpdateServiceDto = {
      name: 'Updated Name',
    };

    mockServiceRepository.findById.mockResolvedValue(null);

    await expect(updateServiceService.execute(serviceId, updateServiceDto)).rejects.toThrow(
      NotFoundException,
    );
    await expect(updateServiceService.execute(serviceId, updateServiceDto)).rejects.toThrow(
      'Service not found',
    );

    expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
    expect(mockServiceRepository.update).not.toHaveBeenCalled();
  });

  it('should update updatedAt timestamp', async () => {
    const serviceId = 'test-id';
    const existingService = new Service(
      {
        name: 'Original Name',
        description: 'Original Description',
        price: 50.0,
        active: true,
        duration: 30,
      },
      serviceId,
    );

    // Only to avoid to have the same updatedAt timestamp
    await new Promise((resolve) => setTimeout(resolve, 1));

    const originalUpdatedAt = existingService.updatedAt;
    const updateServiceDto: UpdateServiceDto = {
      name: 'Updated Name',
    };

    mockServiceRepository.findById.mockResolvedValue(existingService);
    mockServiceRepository.update.mockResolvedValue(undefined);

    const result = await updateServiceService.execute(serviceId, updateServiceDto);

    expect(result.updatedAt).not.toEqual(originalUpdatedAt);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle empty update data', async () => {
    const serviceId = 'test-id';
    const existingService = new Service(
      {
        name: 'Original Name',
        description: 'Original Description',
        price: 50.0,
        active: true,
        duration: 30,
      },
      serviceId,
    );

    const updateServiceDto: UpdateServiceDto = {};

    mockServiceRepository.findById.mockResolvedValue(existingService);
    mockServiceRepository.update.mockResolvedValue(undefined);

    const result = await updateServiceService.execute(serviceId, updateServiceDto);

    expect(result.name).toBe('Original Name');
    expect(result.description).toBe('Original Description');
    expect(result.price).toBe(50.0);
    expect(result.active).toBe(true);
    expect(result.duration).toBe(30);
    expect(mockServiceRepository.update).toHaveBeenCalledWith(result);
  });
});
