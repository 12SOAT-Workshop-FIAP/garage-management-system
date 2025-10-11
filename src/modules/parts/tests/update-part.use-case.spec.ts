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
    save: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
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
    const existingOilFilter: Part = {
      id: 'filter-oil-001',
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
    } as Part;

    it('should update oil filter price successfully', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        price: 52.50,
        costPrice: 36.75,
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      const updatedPart = { ...existingOilFilter, ...updateDto } as Part;
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 52.50,
          costPrice: 36.75,
        })
      );
      expect(result).toEqual(updatedPart);
    });

    it('should update brake pad description and category', async () => {
      // Arrange
      const existingBrakePad: Part = {
        id: 'brake-pad-001',
        name: 'Pastilha de Freio Dianteira',
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.50,
      } as Part;

      const updateDto: UpdatePartDto = {
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
        category: 'sistema-freios',
      };

      repository.findById.mockResolvedValue(existingBrakePad);
      const updatedPart = { ...existingBrakePad, ...updateDto } as Part;
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('brake-pad-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('brake-pad-001');
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
          category: 'sistema-freios',
        })
      );
      expect(result).toEqual(updatedPart);
    });

    it('should update part number when it does not conflict', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        partNumber: 'FO-1620-VW-NEW',
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      repository.findByPartNumber.mockResolvedValue(null); // No conflict
      const updatedPart = { ...existingOilFilter, partNumber: 'FO-1620-VW-NEW' } as Part;
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.findByPartNumber).toHaveBeenCalledWith('FO-1620-VW-NEW');
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          partNumber: 'FO-1620-VW-NEW',
        })
      );
      expect(result).toEqual(updatedPart);
    });

    it('should throw ConflictException when updating to existing part number', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        partNumber: 'PF-5570-VW',
      };

      const existingPartWithSameNumber = {
        id: 'brake-pad-001',
        partNumber: 'PF-5570-VW',
      } as Part;

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
        price: 50.00,
      };

      repository.findById.mockResolvedValue(existingOilFilter);
      repository.findByPartNumber.mockResolvedValue(existingOilFilter); // Same part
      const updatedPart = { ...existingOilFilter, price: 50.00 } as Part;
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('filter-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');
      expect(repository.findByPartNumber).toHaveBeenCalledWith('FO-1620-VW');
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          partNumber: 'FO-1620-VW',
          price: 50.00,
        })
      );
      expect(result).toEqual(updatedPart);
    });

    it('should throw NotFoundException when part does not exist', async () => {
      // Arrange
      const updateDto: UpdatePartDto = {
        price: 100.00,
      };

      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-part', updateDto)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('non-existent-part');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update hydraulic oil supplier and active status', async () => {
      // Arrange
      const hydraulicOil: Part = {
        id: 'hydraulic-oil-001',
        name: 'Óleo Hidráulico ATF',
        category: 'lubrificantes',
        price: 28.90,
        supplier: 'Antigo Fornecedor',
        active: true,
      } as Part;

      const updateDto: UpdatePartDto = {
        supplier: 'Novo Fornecedor Premium',
        active: false,
        minStockLevel: 10,
      };

      repository.findById.mockResolvedValue(hydraulicOil);
      const updatedPart = { ...hydraulicOil, ...updateDto } as Part;
      repository.update.mockResolvedValue(updatedPart);

      // Act
      const result = await useCase.execute('hydraulic-oil-001', updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('hydraulic-oil-001');
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          supplier: 'Novo Fornecedor Premium',
          active: false,
          minStockLevel: 10,
        })
      );
      expect(result).toEqual(updatedPart);
    });
  });
});

