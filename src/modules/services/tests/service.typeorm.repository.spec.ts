import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ServiceTypeOrmRepository,
} from '../infrastructure/repositories/service.typeorm.repository';
import { Service as TypeOrmService } from '../infrastructure/entities/service.entity';
import { Service as ServiceEntity } from '../domain/service.entity';

describe('ServiceTypeOrmRepository', () => {
  let repository: ServiceTypeOrmRepository;
  let typeOrmRepository: jest.Mocked<Repository<TypeOrmService>>;

  const mockServiceEntity = new ServiceEntity(
    {
      name: 'Test Service',
      description: 'Test Description',
      price: 100.0,
      active: true,
      duration: 60,
    },
    'test-id',
  );

  const mockTypeOrmService: TypeOrmService = {
    id: 'test-id',
    name: 'Test Service',
    description: 'Test Description',
    price: 100.0,
    active: true,
    duration: 60,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypeOrmRepository,
        {
          provide: getRepositoryToken(TypeOrmService),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ServiceTypeOrmRepository>(ServiceTypeOrmRepository);
    typeOrmRepository = module.get(getRepositoryToken(TypeOrmService));
  });

  describe('create', () => {
    it('should create a new service successfully', async () => {
      const createdService = { ...mockTypeOrmService };
      typeOrmRepository.create.mockReturnValue(createdService);
      typeOrmRepository.save.mockResolvedValue(createdService);

      await repository.create(mockServiceEntity);

      expect(typeOrmRepository.create).toHaveBeenCalledWith(mockServiceEntity);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(createdService);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      typeOrmRepository.create.mockReturnValue(mockTypeOrmService);
      typeOrmRepository.save.mockRejectedValue(error);

      await expect(repository.create(mockServiceEntity)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update an existing service successfully', async () => {
      typeOrmRepository.save.mockResolvedValue(mockTypeOrmService);

      await repository.update(mockServiceEntity);

      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockServiceEntity);
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Update failed');
      typeOrmRepository.save.mockRejectedValue(error);

      await expect(repository.update(mockServiceEntity)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a service successfully', async () => {
      typeOrmRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      await repository.delete('test-id');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should handle repository errors during deletion', async () => {
      const error = new Error('Delete failed');
      typeOrmRepository.delete.mockRejectedValue(error);

      await expect(repository.delete('test-id')).rejects.toThrow('Delete failed');
    });
  });

  describe('findAll', () => {
    it('should return all services successfully', async () => {
      const mockServices = [mockTypeOrmService];
      typeOrmRepository.find.mockResolvedValue(mockServices);

      const result = await repository.findAll();

      expect(typeOrmRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ServiceEntity);
      expect(result[0].id).toBe('test-id');
      expect(result[0].name).toBe('Test Service');
    });

    it('should return empty array when no services exist', async () => {
      typeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it('should handle repository errors during findAll', async () => {
      const error = new Error('Find all failed');
      typeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow('Find all failed');
    });
  });

  describe('findById', () => {
    it('should return a service when found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockTypeOrmService);

      const result = await repository.findById('test-id');

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(result).toBeInstanceOf(ServiceEntity);
      expect(result?.id).toBe('test-id');
      expect(result?.name).toBe('Test Service');
    });

    it('should return null when service not found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle repository errors during findById', async () => {
      const error = new Error('Find by id failed');
      typeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findById('test-id')).rejects.toThrow('Find by id failed');
    });
  });

  describe('toDomain', () => {
    it('should correctly convert TypeORM entity to domain entity', async () => {
      const typeOrmServiceWithDates = {
        ...mockTypeOrmService,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
      };

      typeOrmRepository.findOne.mockResolvedValue(typeOrmServiceWithDates);

      const result = await repository.findById('test-id');

      expect(result).toBeInstanceOf(ServiceEntity);
      expect(result?.id).toBe('test-id');
      expect(result?.name).toBe('Test Service');
      expect(result?.description).toBe('Test Description');
      expect(result?.price).toBe(100.0);
      expect(result?.active).toBe(true);
      expect(result?.duration).toBe(60);
      expect(result?.createdAt).toEqual(new Date('2023-01-01T10:00:00Z'));
      expect(result?.updatedAt).toEqual(new Date('2023-01-02T10:00:00Z'));
    });
  });
});
