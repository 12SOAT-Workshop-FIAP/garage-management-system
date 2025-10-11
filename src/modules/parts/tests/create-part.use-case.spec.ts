import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreatePartUseCase } from '../application/use-cases/create-part.use-case';
import { PartRepository } from '../domain/repositories/part.repository';
import { Part } from '../domain/entities/part.entity';
import { CreatePartDto } from '../application/dtos/create-part.dto';

describe('CreatePartUseCase', () => {
  let useCase: CreatePartUseCase;
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
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePartUseCase,
        {
          provide: PartRepository,
          useValue: mockPartRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreatePartUseCase>(CreatePartUseCase);
    repository = module.get(PartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const oilFilterDto: CreatePartDto = {
      name: 'Filtro de Óleo do Motor',
      description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',
      partNumber: 'FO-1620-VW',
      category: 'filtros',
      price: 45.90,
      costPrice: 32.15,
      stockQuantity: 25,
      minStockLevel: 5,
      unit: 'PC',
      supplier: 'Auto Peças Central Ltda',
      active: true,
    };

    it('should create an oil filter successfully', async () => {
      // Arrange
      repository.findByPartNumber.mockResolvedValue(null);
      const savedPart = Part.create(oilFilterDto);
      repository.create.mockResolvedValue(savedPart);

      // Act
      const result = await useCase.execute(oilFilterDto);

      // Assert
      expect(repository.findByPartNumber).toHaveBeenCalledWith(oilFilterDto.partNumber);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(savedPart);
    });

    it('should create brake pads successfully', async () => {
      // Arrange
      const brakePadDto: CreatePartDto = {
        name: 'Pastilha de Freio Dianteira',
        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',
        partNumber: 'PF-5570-VW',
        category: 'freios',
        price: 89.50,
        costPrice: 62.65,
        stockQuantity: 12,
        minStockLevel: 3,
        unit: 'SET',
        supplier: 'Freios & Cia Distribuidora',
        active: true,
      };

      repository.findByPartNumber.mockResolvedValue(null);
      const savedPart = Part.create(brakePadDto);
      repository.create.mockResolvedValue(savedPart);

      // Act
      const result = await useCase.execute(brakePadDto);

      // Assert
      expect(repository.findByPartNumber).toHaveBeenCalledWith(brakePadDto.partNumber);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(savedPart);
    });

    it('should create spark plugs successfully', async () => {
      // Arrange
      const sparkPlugDto: CreatePartDto = {
        name: 'Vela de Ignição NGK',
        description: 'Vela de ignição NGK Laser Platinum para motores flex 1.0-1.8',
        partNumber: 'NGK-001',
        category: 'ignicao',
        price: 25.80,
        costPrice: 18.06,
        stockQuantity: 48,
        minStockLevel: 10,
        unit: 'PC',
        supplier: 'Ignição Total Autopeças',
        active: true,
      };
      
      repository.findByPartNumber.mockResolvedValue(null);
      const savedPart = Part.create(sparkPlugDto);
      repository.create.mockResolvedValue(savedPart);

      // Act
      const result = await useCase.execute(sparkPlugDto);

      // Assert
      expect(repository.findByPartNumber).toHaveBeenCalledWith('NGK-001');
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(savedPart);
    });

    it('should throw ConflictException if oil filter part number already exists', async () => {
      // Arrange
      const existingPart = Part.create(oilFilterDto);
      repository.findByPartNumber.mockResolvedValue(existingPart);

      // Act & Assert
      await expect(useCase.execute(oilFilterDto)).rejects.toThrow(ConflictException);
      expect(repository.findByPartNumber).toHaveBeenCalledWith(oilFilterDto.partNumber);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create hydraulic oil with provided values', async () => {
      // Arrange
      const hydraulicOilDto: CreatePartDto = {
        name: 'Óleo Hidráulico ATF',
        description: 'Óleo hidráulico para transmissão automática',
        partNumber: 'ATF-001',
        category: 'lubrificantes',
        price: 28.90,
        costPrice: 21.45,
        stockQuantity: 15,
        minStockLevel: 5,
        unit: 'L',
        supplier: 'Lubricantes S.A.',
        active: true,
      };

      repository.findByPartNumber.mockResolvedValue(null);
      const savedPart = Part.create(hydraulicOilDto);
      repository.create.mockResolvedValue(savedPart);

      // Act
      const result = await useCase.execute(hydraulicOilDto);

      // Assert
      expect(repository.findByPartNumber).toHaveBeenCalledWith('ATF-001');
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(savedPart);
    });
  });
});

