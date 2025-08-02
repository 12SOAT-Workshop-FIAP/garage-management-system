import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from '../application/services/create-service.service';
import { UpdateServiceService } from '../application/services/update-service.service';
import { DeleteServiceService } from '../application/services/delete-service.service';
import { FindAllServicesService } from '../application/services/find-all-services.service';
import { FindServiceByIdService } from '../application/services/find-service-by-id.service';
import { ServiceController } from '../presentation/controllers/service.controller';
import { CreateServiceDto } from '../application/dtos/create-service.dto';
import { UpdateServiceDto } from '../application/dtos/update-service.dto';
import { Service } from '../domain/service.entity';
import { ServiceResponseDto } from '../presentation/dtos/service-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('ServiceController', () => {
  let controller: ServiceController;
  let createServiceService: jest.Mocked<CreateServiceService>;
  let updateServiceService: jest.Mocked<UpdateServiceService>;
  let deleteServiceService: jest.Mocked<DeleteServiceService>;
  let findAllServicesService: jest.Mocked<FindAllServicesService>;
  let findServiceByIdService: jest.Mocked<FindServiceByIdService>;

  const mockService = new Service(
    {
      name: 'Test Service',
      description: 'Test Description',
      price: 100.0,
      active: true,
      duration: 60,
    },
    'test-id',
  );

  const createServiceDto: CreateServiceDto = {
    name: 'Test Service',
    description: 'Test Description',
    price: 100.0,
    active: true,
    duration: 60,
  };

  const updateServiceDto: UpdateServiceDto = {
    name: 'Updated Service',
    price: 150.0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: CreateServiceService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateServiceService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteServiceService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllServicesService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindServiceByIdService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    createServiceService = module.get(CreateServiceService);
    updateServiceService = module.get(UpdateServiceService);
    deleteServiceService = module.get(DeleteServiceService);
    findAllServicesService = module.get(FindAllServicesService);
    findServiceByIdService = module.get(FindServiceByIdService);
  });

  describe('create', () => {
    it('should create a new service successfully', async () => {
      createServiceService.execute.mockResolvedValue(mockService);

      const result = await controller.create(createServiceDto);

      expect(createServiceService.execute).toHaveBeenCalledWith(createServiceDto);
      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.id).toBe(mockService.id);
      expect(result.name).toBe(mockService.name);
      expect(result.description).toBe(mockService.description);
      expect(result.price).toBe(mockService.price);
      expect(result.active).toBe(mockService.active);
      expect(result.duration).toBe(mockService.duration);
    });

    it('should handle service creation errors', async () => {
      const error = new Error('Creation failed');
      createServiceService.execute.mockRejectedValue(error);

      await expect(controller.create(createServiceDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return all services successfully', async () => {
      const mockServices = [mockService];
      findAllServicesService.execute.mockResolvedValue(mockServices);

      const result = await controller.findAll();

      expect(findAllServicesService.execute).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ServiceResponseDto);
      expect(result[0].id).toBe(mockService.id);
      expect(result[0].name).toBe(mockService.name);
    });

    it('should return empty array when no services exist', async () => {
      findAllServicesService.execute.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should handle service retrieval errors', async () => {
      const error = new Error('Retrieval failed');
      findAllServicesService.execute.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Retrieval failed');
    });
  });

  describe('findOne', () => {
    it('should return a service when found', async () => {
      findServiceByIdService.execute.mockResolvedValue(mockService);

      const result = await controller.findOne('test-id');

      expect(findServiceByIdService.execute).toHaveBeenCalledWith('test-id');
      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.id).toBe(mockService.id);
      expect(result.name).toBe(mockService.name);
    });

    it('should handle service not found', async () => {
      const notFoundError = new NotFoundException('Service not found');
      findServiceByIdService.execute.mockRejectedValue(notFoundError);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('should handle service retrieval errors', async () => {
      const error = new Error('Retrieval failed');
      findServiceByIdService.execute.mockRejectedValue(error);

      await expect(controller.findOne('test-id')).rejects.toThrow('Retrieval failed');
    });
  });

  describe('update', () => {
    it('should update a service successfully', async () => {
      const updatedService = new Service(
        {
          name: 'Updated Service',
          description: 'Updated Description',
          price: 150.0,
          active: true,
          duration: 90,
        },
        'test-id',
      );

      updateServiceService.execute.mockResolvedValue(updatedService);

      const result = await controller.update('test-id', updateServiceDto);

      expect(updateServiceService.execute).toHaveBeenCalledWith('test-id', updateServiceDto);
      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.id).toBe(updatedService.id);
      expect(result.name).toBe(updatedService.name);
      expect(result.price).toBe(updatedService.price);
    });

    it('should handle service not found during update', async () => {
      const notFoundError = new NotFoundException('Service not found');
      updateServiceService.execute.mockRejectedValue(notFoundError);

      await expect(controller.update('non-existent-id', updateServiceDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service update errors', async () => {
      const error = new Error('Update failed');
      updateServiceService.execute.mockRejectedValue(error);

      await expect(controller.update('test-id', updateServiceDto)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete a service successfully', async () => {
      deleteServiceService.execute.mockResolvedValue(undefined);

      await controller.remove('test-id');

      expect(deleteServiceService.execute).toHaveBeenCalledWith('test-id');
    });

    it('should handle service not found during deletion', async () => {
      const notFoundError = new NotFoundException('Service not found');
      deleteServiceService.execute.mockRejectedValue(notFoundError);

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('should handle service deletion errors', async () => {
      const error = new Error('Deletion failed');
      deleteServiceService.execute.mockRejectedValue(error);

      await expect(controller.remove('test-id')).rejects.toThrow('Deletion failed');
    });
  });
});
