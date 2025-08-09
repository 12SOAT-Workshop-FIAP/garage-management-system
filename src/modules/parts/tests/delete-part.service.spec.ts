import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeletePartService } from '../application/services/delete-part.service';
import { PartRepository } from '../domain/part.repository';
import { Part } from '../domain/part.entity';


describe('DeletePartService', () => {
  let service: DeletePartService;
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
        DeletePartService,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    service = module.get<DeletePartService>(DeletePartService);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const obsoleteBrakePart: Part = {
      id: 'brake-pad-worn-001',
      name: 'Pastilha de Freio Traseira',
      description: 'Pastilha de freio traseira para Chevrolet Corsa/Celta',
      partNumber: 'PT-7845-GM',
      category: 'freios',
      price: 67.90,
      costPrice: 47.53,
      stockQuantity: 3,
      minStockLevel: 2,
      unit: 'kit',
      supplier: 'Freios Premium Ltda',
      active: true,
      created_at: new Date('2023-12-15T16:20:00Z'),
      updated_at: new Date('2023-12-15T16:20:00Z'),
      isLowStock: jest.fn().mockReturnValue(false),
      updateStock: jest.fn(),
      hasStock: jest.fn().mockReturnValue(true),
    } as any;

    const discontinuedFilter: Part = {
      id: 'air-filter-obsolete-002',
      name: 'Filtro de Ar Cabine',
      description: 'Filtro de ar condicionado para Ford Ka 2008-2013 (descontinuado)',
      partNumber: 'FC-KA-0813-FD',
      category: 'filtros',
      price: 35.40,
      costPrice: 24.78,
      stockQuantity: 1,
      minStockLevel: 0,
      unit: 'piece',
      supplier: 'Filtros & Acessórios Ltda',
      active: false,
      created_at: new Date('2023-08-10T11:15:00Z'),
      updated_at: new Date('2024-01-20T14:30:00Z'),
      isLowStock: jest.fn().mockReturnValue(true),
      updateStock: jest.fn(),
      hasStock: jest.fn().mockReturnValue(true),
    } as any;

    it('should delete worn brake pad successfully', async () => {
      // Arrange
      repository.findById.mockResolvedValue(obsoleteBrakePart);
      repository.delete.mockResolvedValue(undefined);

      // Act
      await service.execute('brake-pad-worn-001');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('brake-pad-worn-001');
      expect(repository.delete).toHaveBeenCalledWith('brake-pad-worn-001');
    });

    it('should delete discontinued air filter successfully', async () => {
      // Arrange
      repository.findById.mockResolvedValue(discontinuedFilter);
      repository.delete.mockResolvedValue(undefined);

      // Act
      await service.execute('air-filter-obsolete-002');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('air-filter-obsolete-002');
      expect(repository.delete).toHaveBeenCalledWith('air-filter-obsolete-002');
    });

    it('should throw NotFoundException when trying to delete non-existent spark plug', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute('spark-plug-missing-999')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('spark-plug-missing-999');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

