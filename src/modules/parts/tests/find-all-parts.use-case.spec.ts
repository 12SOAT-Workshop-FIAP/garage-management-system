import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPartsUseCase } from '../application/use-cases/find-all-parts.use-case';
import { PartRepository } from '../domain/repositories/part.repository';
import { Part } from '../domain/entities/part.entity';
import { FindAllPartsQuery } from '../application/queries/find-all-parts.query';

describe('FindAllPartsUseCase', () => {
  let useCase: FindAllPartsUseCase;
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
        FindAllPartsUseCase,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllPartsUseCase>(FindAllPartsUseCase);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const workshopParts: Part[] = [
      Part.restore({
        id: 'oil-filter-001',
        name: 'Filtro de Óleo do Motor',
        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',
        partNumber: 'FO-1620-VW',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 25,
        minStockLevel: 5,
        unit: 'PC',
        supplier: 'Auto Peças Central Ltda',
        active: true,
        createdAt: new Date('2024-01-10T08:00:00Z'),
        updatedAt: new Date('2024-01-10T08:00:00Z'),
      }),
      Part.restore({
        id: 'brake-pad-001',
        name: 'Pastilha de Freio Dianteira',
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.5,
        costPrice: 62.65,
        stockQuantity: 12,
        minStockLevel: 3,
        unit: 'SET',
        supplier: 'Freios & Cia Distribuidora',
        active: true,
        createdAt: new Date('2024-01-12T10:30:00Z'),
        updatedAt: new Date('2024-01-12T10:30:00Z'),
      }),
      Part.restore({
        id: 'spark-plug-001',
        name: 'Vela de Ignição NGK',
        description: 'Vela de ignição NGK Laser Platinum para motores flex 1.0-1.8',
        partNumber: 'VI-NGK-7090',
        category: 'ignicao',
        price: 25.8,
        costPrice: 18.06,
        stockQuantity: 48,
        minStockLevel: 10,
        unit: 'PC',
        supplier: 'Ignição Total Autopeças',
        active: true,
        createdAt: new Date('2024-01-15T14:45:00Z'),
        updatedAt: new Date('2024-01-15T14:45:00Z'),
      }),
      Part.restore({
        id: 'engine-oil-001',
        name: 'Óleo do Motor 5W30',
        description: 'Óleo sintético Mobil 1 5W30 para motores turbo e aspirados',
        partNumber: 'OM-MOB1-5W30',
        category: 'lubrificantes',
        price: 89.9,
        costPrice: 67.43,
        stockQuantity: 2,
        minStockLevel: 5,
        unit: 'L',
        supplier: 'Lubrificantes São Paulo',
        active: true,
        createdAt: new Date('2024-01-18T09:15:00Z'),
        updatedAt: new Date('2024-01-18T09:15:00Z'),
      }),
    ];

    it('should return all workshop parts when no filters provided', async () => {
      // Arrange
      repository.findAll.mockResolvedValue(workshopParts);

      // Act
      const query = new FindAllPartsQuery();
      const result = await useCase.execute(query);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(workshopParts);
    });

    it('should return filtered brake parts when category filter provided', async () => {
      // Arrange
      const brakeParts = [workshopParts[1]]; // Apenas pastilha de freio
      repository.findAll.mockResolvedValue(brakeParts);

      // Act
      const query = new FindAllPartsQuery();
      const result = await useCase.execute(query);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(brakeParts);
    });

    it('should return filtered ignition parts when category filter provided', async () => {
      // Arrange
      const ignitionParts = [workshopParts[2]]; // Apenas vela de ignição
      repository.findAll.mockResolvedValue(ignitionParts);

      // Act
      const query = new FindAllPartsQuery();
      const result = await useCase.execute(query);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(ignitionParts);
    });
  });

  describe('findLowStock', () => {
    it('should return engine oil with low stock', async () => {
      // Arrange
      const lowStockParts = [
        Part.restore({
          id: 'engine-oil-001',
          name: 'Óleo do Motor 5W30',
          description: 'Óleo sintético Mobil 1 5W30 para motores turbo e aspirados',
          partNumber: 'OM-MOB1-5W30',
          category: 'lubrificantes',
          price: 89.9,
          costPrice: 67.43,
          stockQuantity: 2,
          minStockLevel: 5,
          unit: 'L',
          supplier: 'Lubrificantes São Paulo',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      repository.findAll.mockResolvedValue(lowStockParts);

      // Act
      const result = await useCase.execute(new FindAllPartsQuery());

      // Assert
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(lowStockParts);
    });
  });

  describe('findByCategory', () => {
    it('should return parts by category', async () => {
      // Arrange
      const category = 'engine';
      const categoryParts = [
        Part.restore({
          id: 'engine-part',
          name: 'Engine Part',
          description: 'Engine part description',
          partNumber: 'ENG-001',
          category: 'engine',
          price: 100.0,
          costPrice: 75.0,
          stockQuantity: 10,
          minStockLevel: 2,
          unit: 'PC',
          supplier: 'Engine Supplier',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      repository.findByCategory.mockResolvedValue(categoryParts);

      // Act
      const result = await useCase.findByCategory(category);

      // Assert
      expect(repository.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual(categoryParts);
    });
  });
});
