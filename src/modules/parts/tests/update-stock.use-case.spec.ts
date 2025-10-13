import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';
import { PartRepository } from '../domain/repositories/part.repository';
import { Part } from '../domain/entities/part.entity';
import { UpdateStockCommand } from '../application/commands/update-stock.command';

describe('UpdateStockUseCase', () => {
  let useCase: UpdateStockUseCase;
  let repository: jest.Mocked<PartRepository>;

  const mockPartRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByPartNumber: jest.fn(),
    findByCategory: jest.fn(),
    findLowStockParts: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStockUseCase,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should increase oil filter stock when receiving new shipment', async () => {
      // Arrange
      const oilFilterPart = Part.create({
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
      });

      const command = new UpdateStockCommand('oil-filter-001', 20);
      repository.updateStock.mockResolvedValue(oilFilterPart);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(repository.updateStock).toHaveBeenCalledWith('oil-filter-001', 20);
      expect(result).toEqual(oilFilterPart);
    });

    it('should decrease brake fluid stock when used in service', async () => {
      // Arrange
      const brakeFluidPart = Part.create({
        name: 'Fluido de Freio DOT 4',
        description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',
        partNumber: 'FF-DOT4-500ML',
        category: 'lubrificantes',
        price: 32.5,
        costPrice: 22.75,
        stockQuantity: 3,
        minStockLevel: 8,
        unit: 'L',
        supplier: 'Bosch Automotive',
      });

      const command = new UpdateStockCommand('brake-fluid-001', -2);
      repository.updateStock.mockResolvedValue(brakeFluidPart);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(repository.updateStock).toHaveBeenCalledWith('brake-fluid-001', -2);
      expect(result).toEqual(brakeFluidPart);
    });

    it('should adjust stock due to inventory count discrepancy', async () => {
      // Arrange
      const oilFilterPart = Part.create({
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
      });

      const command = new UpdateStockCommand('oil-filter-001', -5);
      repository.updateStock.mockResolvedValue(oilFilterPart);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(repository.updateStock).toHaveBeenCalledWith('oil-filter-001', -5);
      expect(result).toEqual(oilFilterPart);
    });

    it('should return null when timing belt part not found', async () => {
      // Arrange
      const command = new UpdateStockCommand('non-existent-id', 10);
      repository.updateStock.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(repository.updateStock).toHaveBeenCalledWith('non-existent-id', 10);
      expect(result).toBeNull();
    });
  });
});
