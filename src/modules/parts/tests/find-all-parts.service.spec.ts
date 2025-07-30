import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPartsService } from '../application/services/find-all-parts.service';
import { PartRepository } from '../domain/part.repository';
import { Part } from '../domain/part.entity';

describe('FindAllPartsService', () => {
  let service: FindAllPartsService;
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
        FindAllPartsService,
        {
          provide: 'PartRepository',
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllPartsService>(FindAllPartsService);
    repository = module.get('PartRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const workshopParts: Part[] = [
      {
        id: 'oil-filter-001',
        name: 'Filtro de Óleo do Motor',
        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',
        partNumber: 'FO-1620-VW',
        category: 'filtros',
        price: 45.90,
        costPrice: 32.15,
        stockQuantity: 25,
        minStockLevel: 5,
        unit: 'piece',
        supplier: 'Auto Peças Central Ltda',
        active: true,
        created_at: new Date('2024-01-10T08:00:00Z'),
        updated_at: new Date('2024-01-10T08:00:00Z'),
        isLowStock: jest.fn().mockReturnValue(false),
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any,
      {
        id: 'brake-pad-001',
        name: 'Pastilha de Freio Dianteira',
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.50,
        costPrice: 62.65,
        stockQuantity: 12,
        minStockLevel: 3,
        unit: 'kit',
        supplier: 'Freios & Cia Distribuidora',
        active: true,
        created_at: new Date('2024-01-12T10:30:00Z'),
        updated_at: new Date('2024-01-12T10:30:00Z'),
        isLowStock: jest.fn().mockReturnValue(false),
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any,
      {
        id: 'spark-plug-001',
        name: 'Vela de Ignição NGK',
        description: 'Vela de ignição NGK Laser Platinum para motores flex 1.0-1.8',
        partNumber: 'VI-NGK-7090',
        category: 'ignicao',
        price: 25.80,
        costPrice: 18.06,
        stockQuantity: 48,
        minStockLevel: 10,
        unit: 'piece',
        supplier: 'Ignição Total Autopeças',
        active: true,
        created_at: new Date('2024-01-15T14:45:00Z'),
        updated_at: new Date('2024-01-15T14:45:00Z'),
        isLowStock: jest.fn().mockReturnValue(false),
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any,
      {
        id: 'engine-oil-001',
        name: 'Óleo do Motor 5W30',
        description: 'Óleo sintético Mobil 1 5W30 para motores turbo e aspirados',
        partNumber: 'OM-MOB1-5W30',
        category: 'lubrificantes',
        price: 89.90,
        costPrice: 67.43,
        stockQuantity: 2,
        minStockLevel: 5,
        unit: 'liter',
        supplier: 'Lubrificantes São Paulo',
        active: true,
        created_at: new Date('2024-01-18T09:15:00Z'),
        updated_at: new Date('2024-01-18T09:15:00Z'),
        isLowStock: jest.fn().mockReturnValue(true), // Estoque baixo
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any,
    ];

    it('should return all workshop parts when no filters provided', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(workshopParts);

      // Act
      const result = await service.execute();

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(workshopParts);
    });

    it('should return filtered brake parts when category filter provided', async () => {
      // Arrange
      const filters = { category: 'freios', active: true };
      const brakeParts = [workshopParts[1]]; // Apenas pastilha de freio
      repository.findAll.mockResolvedValue(brakeParts);

      // Act
      const result = await service.execute(filters);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(brakeParts);
    });

    it('should return filtered ignition parts when category filter provided', async () => {
      // Arrange
      const filters = { category: 'ignicao' };
      const ignitionParts = [workshopParts[2]]; // Apenas vela de ignição
      repository.findAll.mockResolvedValue(ignitionParts);

      // Act
      const result = await service.execute(filters);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(ignitionParts);
    });
  });

  describe('findLowStock', () => {
    it('should return engine oil with low stock', async () => {
      // Arrange
      const lowStockParts = [
        {
          id: 'engine-oil-001',
          name: 'Óleo do Motor 5W30',
          description: 'Óleo sintético Mobil 1 5W30 para motores turbo e aspirados',
          stockQuantity: 2,
          minStockLevel: 5,
          category: 'lubrificantes',
          isLowStock: jest.fn().mockReturnValue(true),
        } as any,
      ];
      repository.findLowStockParts.mockResolvedValue(lowStockParts);

      // Act
      const result = await service.findLowStock();

      // Assert
      expect(repository.findLowStockParts).toHaveBeenCalled();
      expect(result).toEqual(lowStockParts);
    });
  });

  describe('findByCategory', () => {
    it('should return parts by category', async () => {
      // Arrange
      const category = 'engine';
      const categoryParts = [
        {
          id: 'engine-part',
          name: 'Engine Part',
          category: 'engine',
          price: 100.0,
          costPrice: 75.0,
          stockQuantity: 10,
          minStockLevel: 2,
          unit: 'piece',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          isLowStock: jest.fn().mockReturnValue(false),
          updateStock: jest.fn(),
          hasStock: jest.fn().mockReturnValue(true),
        } as any,
      ];
      repository.findByCategory.mockResolvedValue(categoryParts);

      // Act
      const result = await service.findByCategory(category);

      // Assert
      expect(repository.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual(categoryParts);
    });
  });
});
