import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case';
import { PartRepository } from '../domain/repositories/part.repository';
import { Part } from '../domain/entities/part.entity';
import { UpdatePartDto } from '../application/dtos/update-part.dto';

describe('UpdatePartUseCase', () => {
  let useCase: UpdatePartUseCase;
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
        UpdatePartUseCase,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdatePartUseCase>(UpdatePartUseCase);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const existingOilFilter = Part.restore({
      id: 'filter-oil-001',
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should update oil filter price successfully', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        price: 52.5,
        costPrice: 36.75,
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      const updatedPart = Part.restore({
        id: 'filter-oil-001',
        name: existingOilFilter.name.value,
        description: existingOilFilter.description.value,
        partNumber: existingOilFilter.partNumber.value,
        category: existingOilFilter.category.value,
        price: updateDto.price || existingOilFilter.price.value,
        costPrice: updateDto.costPrice || existingOilFilter.costPrice.value,
        stockQuantity: existingOilFilter.stockQuantity.value,
        minStockLevel: existingOilFilter.minStockLevel,
        unit: existingOilFilter.unit.value,
        supplier: existingOilFilter.supplier.value,
        active: existingOilFilter.isActive,
        createdAt: existingOilFilter.createdAt,
        updatedAt: new Date(),
      });
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
    });

    it('should update brake pad description and category', async () => {
      // Arrange
      const existingBrakePad = Part.restore({
        id: 'brake-pad-001',
        name: 'Pastilha de Freio Dianteira',
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.5,
        costPrice: 62.65,
        stockQuantity: 12,
        minStockLevel: 3,
        unit: 'SET',
        supplier: 'Freios & Cia Distribuidora',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateDto: UpdatePartDto = {
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
        category: 'sistema-freios',
      };

      repository.findById.mockResolvedValue(existingBrakePad);
      const updatedPart = Part.restore({
        id: 'brake-pad-001',
        name: existingBrakePad.name.value,
        description: updateDto.description || existingBrakePad.description.value,
        partNumber: existingBrakePad.partNumber.value,
        category: updateDto.category || existingBrakePad.category.value,
        price: existingBrakePad.price.value,
        costPrice: existingBrakePad.costPrice.value,
        stockQuantity: existingBrakePad.stockQuantity.value,
        minStockLevel: existingBrakePad.minStockLevel,
        unit: existingBrakePad.unit.value,
        supplier: existingBrakePad.supplier.value,
        active: existingBrakePad.isActive,
        createdAt: existingBrakePad.createdAt,
        updatedAt: new Date(),
      });
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('brake-pad-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('brake-pad-001');
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
    });

    it('should update part number when it does not conflict', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        partNumber: 'FO-1620-VW-NEW',
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      repository.findByPartNumber.mockResolvedValue(null); // No conflict
      const updatedPart = Part.restore({
        id: 'filter-oil-001',
        name: existingOilFilter.name.value,
        description: existingOilFilter.description.value,
        partNumber: 'FO-1620-VW-NEW',
        category: existingOilFilter.category.value,
        price: existingOilFilter.price.value,
        costPrice: existingOilFilter.costPrice.value,
        stockQuantity: existingOilFilter.stockQuantity.value,
        minStockLevel: existingOilFilter.minStockLevel,
        unit: existingOilFilter.unit.value,
        supplier: existingOilFilter.supplier.value,
        active: existingOilFilter.isActive,
        createdAt: existingOilFilter.createdAt,
        updatedAt: new Date(),
      });
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.findByPartNumber).toHaveBeenCalledWith('FO-1620-VW-NEW');
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
    });

    it('should throw ConflictException when updating to existing part number', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        partNumber: 'PF-5570-VW',
      };

      const existingPartWithSameNumber = Part.restore({
        id: 'brake-pad-001',
        name: 'Pastilha de Freio',
        description: 'Pastilha de freio',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.5,
        costPrice: 62.65,
        stockQuantity: 12,
        minStockLevel: 3,
        unit: 'SET',
        supplier: 'Fornecedor',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repository.findById.mockResolvedValue(existingOilFilter);
      repository.findByPartNumber.mockResolvedValue(existingPartWithSameNumber);

      // Act & Assert
      await expect(useCase.execute('filter-oil-001', updateDto)).rejects.toThrow(ConflictException);
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.findByPartNumber).toHaveBeenCalledWith('PF-5570-VW');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should allow updating part number to the same value', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        partNumber: 'FO-1620-VW', // Same as existing
        price: 50.0,
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      repository.findByPartNumber.mockResolvedValue(existingOilFilter); // Same part
      const updatedPart = Part.restore({
        id: 'filter-oil-001',
        name: existingOilFilter.name.value,
        description: existingOilFilter.description.value,
        partNumber: existingOilFilter.partNumber.value,
        category: existingOilFilter.category.value,
        price: 50.0,
        costPrice: existingOilFilter.costPrice.value,
        stockQuantity: existingOilFilter.stockQuantity.value,
        minStockLevel: existingOilFilter.minStockLevel,
        unit: existingOilFilter.unit.value,
        supplier: existingOilFilter.supplier.value,
        active: existingOilFilter.isActive,
        createdAt: existingOilFilter.createdAt,
        updatedAt: new Date(),
      });
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.findByPartNumber).not.toHaveBeenCalled(); // Should not be called when partNumber is the same
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
    });

    it('should throw NotFoundException when part does not exist', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        price: 100.0,
      };

      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-part', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledWith('non-existent-part');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update hydraulic oil supplier and active status', async () => {
      // Arrange
      const hydraulicOil = Part.restore({
        id: 'hydraulic-oil-001',
        name: 'Óleo Hidráulico ATF',
        description: 'Óleo hidráulico para transmissão automática',
        partNumber: 'ATF-001',
        category: 'lubrificantes',
        price: 28.9,
        costPrice: 21.45,
        stockQuantity: 15,
        minStockLevel: 5,
        unit: 'L',
        supplier: 'Antigo Fornecedor',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateDto: UpdatePartDto = {
        supplier: 'Novo Fornecedor Premium',
        active: false,
        minStockLevel: 10,
      };

      repository.findById.mockResolvedValue(hydraulicOil);
      const updatedPart = Part.restore({
        id: 'hydraulic-oil-001',
        name: hydraulicOil.name.value,
        description: hydraulicOil.description.value,
        partNumber: hydraulicOil.partNumber.value,
        category: hydraulicOil.category.value,
        price: hydraulicOil.price.value,
        costPrice: hydraulicOil.costPrice.value,
        stockQuantity: hydraulicOil.stockQuantity.value,
        minStockLevel: updateDto.minStockLevel || hydraulicOil.minStockLevel,
        unit: hydraulicOil.unit.value,
        supplier: updateDto.supplier || hydraulicOil.supplier.value,
        active: updateDto.active !== undefined ? updateDto.active : hydraulicOil.isActive,
        createdAt: hydraulicOil.createdAt,
        updatedAt: new Date(),
      });
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('hydraulic-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('hydraulic-oil-001');
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPart);
    });
  });
});
