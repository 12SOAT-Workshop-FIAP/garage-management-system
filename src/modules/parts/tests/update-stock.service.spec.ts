import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateStockService } from '../application/services/update-stock.service';
import { PartRepository } from '../domain/part.repository';
import { Part } from '../domain/part.entity';
import { UpdateStockDto } from '../application/dtos/update-part.dto';


describe('UpdateStockService', () => {
  let service: UpdateStockService;
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
        UpdateStockService,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateStockService>(UpdateStockService);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const oilFilterPart: Part = {
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
    } as any;

    const brakeFluidPart: Part = {
      id: 'brake-fluid-001',
      name: 'Fluido de Freio DOT 4',
      description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',
      partNumber: 'FF-DOT4-500ML',
      category: 'lubrificantes',
      price: 32.50,
      costPrice: 22.75,
      stockQuantity: 3,
      minStockLevel: 8,
      unit: 'bottle',
      supplier: 'Bosch Automotive',
      active: true,
      created_at: new Date('2024-01-20T15:30:00Z'),
      updated_at: new Date('2024-01-20T15:30:00Z'),
      isLowStock: jest.fn().mockReturnValue(true),
      updateStock: jest.fn(),
      hasStock: jest.fn().mockReturnValue(true),
    } as any;

    it('should increase oil filter stock when receiving new shipment', async () => {
      // Arrange
      const updateStockDto: UpdateStockDto = {
        stockQuantity: 20,
      };
      repository.findById.mockResolvedValue(oilFilterPart);
      repository.save.mockResolvedValue(oilFilterPart);

      // Act
      const result = await service.execute('oil-filter-001', updateStockDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('oil-filter-001');
      expect(oilFilterPart.updateStock).toHaveBeenCalledWith(20);
      expect(repository.save).toHaveBeenCalledWith(oilFilterPart);
      expect(result).toEqual(oilFilterPart);
    });

    it('should decrease brake fluid stock when used in service', async () => {
      // Arrange
      const updateStockDto: UpdateStockDto = {
        stockQuantity: -2,
      };
      repository.findById.mockResolvedValue(brakeFluidPart);
      repository.save.mockResolvedValue(brakeFluidPart);

      // Act
      const result = await service.execute('brake-fluid-001', updateStockDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('brake-fluid-001');
      expect(brakeFluidPart.updateStock).toHaveBeenCalledWith(-2);
      expect(repository.save).toHaveBeenCalledWith(brakeFluidPart);
      expect(result).toEqual(brakeFluidPart);
    });

    it('should adjust stock due to inventory count discrepancy', async () => {
      // Arrange
      const updateStockDto: UpdateStockDto = {
        stockQuantity: -5,
      };
      repository.findById.mockResolvedValue(oilFilterPart);
      repository.save.mockResolvedValue(oilFilterPart);

      // Act
      const result = await service.execute('oil-filter-001', updateStockDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('oil-filter-001');
      expect(oilFilterPart.updateStock).toHaveBeenCalledWith(-5);
      expect(repository.save).toHaveBeenCalledWith(oilFilterPart);
      expect(result).toEqual(oilFilterPart);
    });

    it('should throw NotFoundException when timing belt part not found', async () => {
      // Arrange
      const updateStockDto: UpdateStockDto = {
        stockQuantity: 10,
      };
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute('timing-belt-missing-999', updateStockDto)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('timing-belt-missing-999');
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to reduce brake fluid stock below zero', async () => {
      // Arrange
      const criticalStockPart = {
        ...brakeFluidPart,
        stockQuantity: 2,
        isLowStock: jest.fn().mockReturnValue(true),
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any;
      const updateStockDto: UpdateStockDto = {
        stockQuantity: -5,
      };
      repository.findById.mockResolvedValue(criticalStockPart);

      // Act & Assert
      await expect(service.execute('brake-fluid-001', updateStockDto)).rejects.toThrow(BadRequestException);
      expect(repository.findById).toHaveBeenCalledWith('brake-fluid-001');
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});

