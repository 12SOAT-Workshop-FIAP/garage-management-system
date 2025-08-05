import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindPartByIdService } from '../application/services/find-part-by-id.service';
import { PartRepository } from '../domain/part.repository';
import { Part } from '../domain/part.entity';
import { PART_REPOSITORY } from '../infrastructure/repositories/part.typeorm.repository';

describe('FindPartByIdService', () => {
  let service: FindPartByIdService;
  let repository: jest.Mocked<PartRepository>;

  const mockPartRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByPartNumber: jest.fn(),
    findByCategory: jest.fn(),
    findLowStockParts: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPartByIdService,
        {
          provide: PART_REPOSITORY,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    service = module.get<FindPartByIdService>(FindPartByIdService);
    repository = module.get(PART_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const brakeDiscPart: Part = {
      id: 'brake-disc-001',
      name: 'Disco de Freio Ventilado',
      description: 'Disco de freio ventilado para VW Gol/Voyage - par',
      partNumber: 'DF-280-VW',
      category: 'freios',
      price: 156.90,
      costPrice: 109.83,
      stockQuantity: 8,
      minStockLevel: 2,
      unit: 'pair',
      supplier: 'Freios Premium Ltda',
      active: true,
      created_at: new Date('2024-01-15T10:30:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z'),
      isLowStock: jest.fn().mockReturnValue(false),
      updateStock: jest.fn(),
      hasStock: jest.fn().mockReturnValue(true),
    } as any;

    const airFilterPart: Part = {
      id: 'air-filter-002',
      name: 'Filtro de Ar do Motor',
      description: 'Filtro de ar esportivo K&N para motores 1.6-2.0 turbo',
      partNumber: 'FA-KN-33-2865',
      category: 'filtros',
      price: 285.00,
      costPrice: 199.50,
      stockQuantity: 6,
      minStockLevel: 2,
      unit: 'piece',
      supplier: 'K&N Filtros Brasil',
      active: true,
      created_at: new Date('2024-02-20T14:15:00Z'),
      updated_at: new Date('2024-02-20T14:15:00Z'),
      isLowStock: jest.fn().mockReturnValue(false),
      updateStock: jest.fn(),
      hasStock: jest.fn().mockReturnValue(true),
    } as any;

    it('should return brake disc when found by id', async () => {
      // Arrange
      repository.findById.mockResolvedValue(brakeDiscPart);

      // Act
      const result = await service.execute('brake-disc-001');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('brake-disc-001');
      expect(result).toEqual(brakeDiscPart);
    });

    it('should return air filter when found by id', async () => {
      // Arrange
      repository.findById.mockResolvedValue(airFilterPart);

      // Act
      const result = await service.execute('air-filter-002');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('air-filter-002');
      expect(result).toEqual(airFilterPart);
    });

    it('should throw NotFoundException when timing belt not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute('timing-belt-999')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('timing-belt-999');
    });
  });
});
