import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';

import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';

import { PartRepository } from '../domain/repositories/part.repository';import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';

import { Part } from '../domain/entities/part.entity';

import { UpdateStockCommand } from '../application/commands/update-stock.command';import { PartRepository } from '../domain/repositories/part.repository';import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';import { NotFoundException, BadRequestException } from '@nestjs/common';



describe('UpdateStockUseCase', () => {import { Part } from '../domain/entities/part.entity';

  let useCase: UpdateStockUseCase;

  let repository: jest.Mocked<PartRepository>;import { UpdateStockCommand } from '../application/commands/update-stock.command';import { PartRepository } from '../domain/repositories/part.repository';import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';



  const mockPartRepository = {

    findById: jest.fn(),

    findAll: jest.fn(),describe('UpdateStockUseCase', () => {import { Part } from '../domain/entities/part.entity';import { PartRepository } from '../domain/repositories/part.repository';

    findByPartNumber: jest.fn(),

    findByCategory: jest.fn(),  let useCase: UpdateStockUseCase;

    findLowStockParts: jest.fn(),

    create: jest.fn(),  let repository: jest.Mocked<PartRepository>;import { UpdateStockCommand } from '../application/commands/update-stock.command';import { Part } from '../domain/entities/part.entity';

    update: jest.fn(),

    delete: jest.fn(),

    updateStock: jest.fn(),

  };  const mockPartRepository = {import { UpdateStockDto } from '../application/dtos/update-part.dto';



  beforeEach(async () => {    findById: jest.fn(),

    const module: TestingModule = await Test.createTestingModule({

      providers: [    findAll: jest.fn(),describe('UpdateStockUseCase', () => {

        UpdateStockUseCase,

        {    findByPartNumber: jest.fn(),

          provide: PartRepository,

          useValue: mockPartRepository,    findByCategory: jest.fn(),  let useCase: UpdateStockUseCase;

        },

      ],    findLowStockParts: jest.fn(),

    }).compile();

    create: jest.fn(),  let repository: jest.Mocked<PartRepository>;describe('UpdateStockUseCase', () => {

    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);

    repository = module.get(PartRepository);    update: jest.fn(),

  });

    delete: jest.fn(),  let useCase: UpdateStockUseCase;

  afterEach(() => {

    jest.clearAllMocks();    updateStock: jest.fn(),

  });

  };  const mockPartRepository = {  let repository: jest.Mocked<PartRepository>;

  describe('execute', () => {

    it('should increase oil filter stock when receiving new shipment', async () => {

      // Arrange

      const oilFilterPart = Part.create({  beforeEach(async () => {    findById: jest.fn(),

        name: 'Filtro de Óleo do Motor',

        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',    const module: TestingModule = await Test.createTestingModule({

        partNumber: 'FO-1620-VW',

        category: 'filtros',      providers: [    findAll: jest.fn(),  const mockPartRepository = {

        price: 45.90,

        costPrice: 32.15,        UpdateStockUseCase,

        stockQuantity: 25,

        minStockLevel: 5,        {    findByPartNumber: jest.fn(),    findById: jest.fn(),

        unit: 'PC',

        supplier: 'Auto Peças Central Ltda',          provide: PartRepository,

      });

                useValue: mockPartRepository,    findByCategory: jest.fn(),    findAll: jest.fn(),

      const command = new UpdateStockCommand(1, 20);

      repository.updateStock.mockResolvedValue(oilFilterPart);        },



      // Act      ],    findLowStockParts: jest.fn(),    findByPartNumber: jest.fn(),

      const result = await useCase.execute(command);

    }).compile();

      // Assert

      expect(repository.updateStock).toHaveBeenCalledWith(1, 20);    create: jest.fn(),    findByCategory: jest.fn(),

      expect(result).toEqual(oilFilterPart);

    });    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);



    it('should decrease brake fluid stock when used in service', async () => {    repository = module.get(PartRepository);    update: jest.fn(),    findLowStockParts: jest.fn(),

      // Arrange

      const brakeFluidPart = Part.create({  });

        name: 'Fluido de Freio DOT 4',

        description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',    delete: jest.fn(),    save: jest.fn(),

        partNumber: 'FF-DOT4-500ML',

        category: 'lubrificantes',  afterEach(() => {

        price: 32.50,

        costPrice: 22.75,    jest.clearAllMocks();    updateStock: jest.fn(),    delete: jest.fn(),

        stockQuantity: 3,

        minStockLevel: 8,  });

        unit: 'BOX',

        supplier: 'Bosch Automotive',  };    count: jest.fn(),

      });

  describe('execute', () => {

      const command = new UpdateStockCommand(2, -2);

      repository.updateStock.mockResolvedValue(brakeFluidPart);    it('should increase oil filter stock when receiving new shipment', async () => {  };



      // Act      // Arrange

      const result = await useCase.execute(command);

      const oilFilterPart = Part.create({  beforeEach(async () => {

      // Assert

      expect(repository.updateStock).toHaveBeenCalledWith(2, -2);        name: 'Filtro de Óleo do Motor',

      expect(result).toEqual(brakeFluidPart);

    });        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',    const module: TestingModule = await Test.createTestingModule({  beforeEach(async () => {



    it('should adjust stock due to inventory count discrepancy', async () => {        partNumber: 'FO-1620-VW',

      // Arrange

      const oilFilterPart = Part.create({        category: 'filtros',      providers: [    const module: TestingModule = await Test.createTestingModule({

        name: 'Filtro de Óleo do Motor',

        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',        price: 45.90,

        partNumber: 'FO-1620-VW',

        category: 'filtros',        costPrice: 32.15,        UpdateStockUseCase,      providers: [

        price: 45.90,

        costPrice: 32.15,        stockQuantity: 25,

        stockQuantity: 25,

        minStockLevel: 5,        minStockLevel: 5,        {        UpdateStockUseCase,

        unit: 'PC',

        supplier: 'Auto Peças Central Ltda',        unit: 'piece',

      });

        supplier: 'Auto Peças Central Ltda',          provide: PartRepository,        {

      const command = new UpdateStockCommand(1, -5);

      repository.updateStock.mockResolvedValue(oilFilterPart);      });



      // Act                useValue: mockPartRepository,          provide: PartRepository,

      const result = await useCase.execute(command);

      const command = new UpdateStockCommand(1, 20);

      // Assert

      expect(repository.updateStock).toHaveBeenCalledWith(1, -5);      repository.updateStock.mockResolvedValue(oilFilterPart);        },          useValue: mockPartRepository,

      expect(result).toEqual(oilFilterPart);

    });



    it('should return null when timing belt part not found', async () => {      // Act      ],        },

      // Arrange

      const command = new UpdateStockCommand(999, 10);      const result = await useCase.execute(command);

      repository.updateStock.mockResolvedValue(null);

    }).compile();      ],

      // Act

      const result = await useCase.execute(command);      // Assert



      // Assert      expect(repository.updateStock).toHaveBeenCalledWith(1, 20);    }).compile();

      expect(repository.updateStock).toHaveBeenCalledWith(999, 10);

      expect(result).toBeNull();      expect(result).toEqual(oilFilterPart);

    });

  });    });    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);

});



    it('should decrease brake fluid stock when used in service', async () => {    repository = module.get(PartRepository);    useCase = module.get<UpdateStockUseCase>(UpdateStockUseCase);

      // Arrange

      const brakeFluidPart = Part.create({  });    repository = module.get(PartRepository);

        name: 'Fluido de Freio DOT 4',

        description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',  });

        partNumber: 'FF-DOT4-500ML',

        category: 'lubrificantes',  afterEach(() => {

        price: 32.50,

        costPrice: 22.75,    jest.clearAllMocks();  afterEach(() => {

        stockQuantity: 3,

        minStockLevel: 8,  });    jest.clearAllMocks();

        unit: 'bottle',

        supplier: 'Bosch Automotive',  });

      });

  describe('execute', () => {

      const command = new UpdateStockCommand(2, -2);

      repository.updateStock.mockResolvedValue(brakeFluidPart);    it('should increase oil filter stock when receiving new shipment', async () => {  describe('execute', () => {



      // Act      // Arrange    const oilFilterPart: Part = {

      const result = await useCase.execute(command);

      const oilFilterPart = Part.create({      id: 'oil-filter-001',

      // Assert

      expect(repository.updateStock).toHaveBeenCalledWith(2, -2);        name: 'Filtro de Óleo do Motor',      name: 'Filtro de Óleo do Motor',

      expect(result).toEqual(brakeFluidPart);

    });        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',      description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',



    it('should adjust stock due to inventory count discrepancy', async () => {        partNumber: 'FO-1620-VW',      partNumber: 'FO-1620-VW',

      // Arrange

      const oilFilterPart = Part.create({        category: 'filtros',      category: 'filtros',

        name: 'Filtro de Óleo do Motor',

        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',        price: 45.90,      price: 45.90,

        partNumber: 'FO-1620-VW',

        category: 'filtros',        costPrice: 32.15,      costPrice: 32.15,

        price: 45.90,

        costPrice: 32.15,        stockQuantity: 25,      quantity: 25,

        stockQuantity: 25,

        minStockLevel: 5,        minStockLevel: 5,      minStockLevel: 5,

        unit: 'piece',

        supplier: 'Auto Peças Central Ltda',        unit: 'piece',      unit: 'piece',

      });

        supplier: 'Auto Peças Central Ltda',      supplier: 'Auto Peças Central Ltda',

      const command = new UpdateStockCommand(1, -5);

      repository.updateStock.mockResolvedValue(oilFilterPart);      });      active: true,



      // Act            created_at: new Date('2024-01-10T08:00:00Z'),

      const result = await useCase.execute(command);

      const command = new UpdateStockCommand(1, 20);      updated_at: new Date('2024-01-10T08:00:00Z'),

      // Assert

      expect(repository.updateStock).toHaveBeenCalledWith(1, -5);      repository.updateStock.mockResolvedValue(oilFilterPart);      isLowStock: jest.fn().mockReturnValue(false),

      expect(result).toEqual(oilFilterPart);

    });      updateStock: jest.fn(),



    it('should return null when timing belt part not found', async () => {      // Act      hasStock: jest.fn().mockReturnValue(true),

      // Arrange

      const command = new UpdateStockCommand(999, 10);      const result = await useCase.execute(command);    } as any;

      repository.updateStock.mockResolvedValue(null);



      // Act

      const result = await useCase.execute(command);      // Assert    const brakeFluidPart: Part = {



      // Assert      expect(repository.updateStock).toHaveBeenCalledWith(1, 20);      id: 'brake-fluid-001',

      expect(repository.updateStock).toHaveBeenCalledWith(999, 10);

      expect(result).toBeNull();      expect(result).toEqual(oilFilterPart);      name: 'Fluido de Freio DOT 4',

    });

  });    });      description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',

});

      partNumber: 'FF-DOT4-500ML',

    it('should decrease brake fluid stock when used in service', async () => {      category: 'lubrificantes',

      // Arrange      price: 32.50,

      const brakeFluidPart = Part.create({      costPrice: 22.75,

        name: 'Fluido de Freio DOT 4',      quantity: 3,

        description: 'Fluido de freio sintético DOT 4 Bosch para sistemas de freio e embreagem',      minStockLevel: 8,

        partNumber: 'FF-DOT4-500ML',      unit: 'bottle',

        category: 'lubrificantes',      supplier: 'Bosch Automotive',

        price: 32.50,      active: true,

        costPrice: 22.75,      created_at: new Date('2024-01-20T15:30:00Z'),

        stockQuantity: 3,      updated_at: new Date('2024-01-20T15:30:00Z'),

        minStockLevel: 8,      isLowStock: jest.fn().mockReturnValue(true),

        unit: 'bottle',      updateStock: jest.fn(),

        supplier: 'Bosch Automotive',      hasStock: jest.fn().mockReturnValue(true),

      });    } as any;



      const command = new UpdateStockCommand(2, -2);    it('should increase oil filter stock when receiving new shipment', async () => {

      repository.updateStock.mockResolvedValue(brakeFluidPart);      // Arrange

      const updateStockDto: UpdateStockDto = {

      // Act        quantity: 20,

      const result = await useCase.execute(command);      };

      repository.findById.mockResolvedValue(oilFilterPart);

      // Assert      

      expect(repository.updateStock).toHaveBeenCalledWith(2, -2);

      expect(result).toEqual(brakeFluidPart);      // Act

    });      const result = await useCase.execute('oil-filter-001');



    it('should adjust stock due to inventory count discrepancy', async () => {      // Assert

      // Arrange      expect(repository.findById).toHaveBeenCalledWith('oil-filter-001');

      const oilFilterPart = Part.create({      expect(oilFilterPart.updateStock).toHaveBeenCalledWith(20);

        name: 'Filtro de Óleo do Motor',      expect(

        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',      expect(result).toEqual(oilFilterPart);

        partNumber: 'FO-1620-VW',    });

        category: 'filtros',

        price: 45.90,    it('should decrease brake fluid stock when used in service', async () => {

        costPrice: 32.15,      // Arrange

        stockQuantity: 25,      const updateStockDto: UpdateStockDto = {

        minStockLevel: 5,        quantity: -2,

        unit: 'piece',      };

        supplier: 'Auto Peças Central Ltda',      repository.findById.mockResolvedValue(brakeFluidPart);

      });      



      const command = new UpdateStockCommand(1, -5);      // Act

      repository.updateStock.mockResolvedValue(oilFilterPart);      const result = await useCase.execute('brake-fluid-001');



      // Act      // Assert

      const result = await useCase.execute(command);      expect(repository.findById).toHaveBeenCalledWith('brake-fluid-001');

      expect(brakeFluidPart.updateStock).toHaveBeenCalledWith(-2);

      // Assert      expect(

      expect(repository.updateStock).toHaveBeenCalledWith(1, -5);      expect(result).toEqual(brakeFluidPart);

      expect(result).toEqual(oilFilterPart);    });

    });

    it('should adjust stock due to inventory count discrepancy', async () => {

    it('should return null when timing belt part not found', async () => {      // Arrange

      // Arrange      const updateStockDto: UpdateStockDto = {

      const command = new UpdateStockCommand(999, 10);        quantity: -5,

      repository.updateStock.mockResolvedValue(null);      };

      repository.findById.mockResolvedValue(oilFilterPart);

      // Act      

      const result = await useCase.execute(command);

      // Act

      // Assert      const result = await useCase.execute('oil-filter-001');

      expect(repository.updateStock).toHaveBeenCalledWith(999, 10);

      expect(result).toBeNull();      // Assert

    });      expect(repository.findById).toHaveBeenCalledWith('oil-filter-001');

  });      expect(oilFilterPart.updateStock).toHaveBeenCalledWith(-5);

});      expect(

      expect(result).toEqual(oilFilterPart);
    });

    it('should throw NotFoundException when timing belt part not found', async () => {
      // Arrange
      const updateStockDto: UpdateStockDto = {
        quantity: 10,
      };
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('timing-belt-missing-999')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('timing-belt-missing-999');
      expect(
    });

    it('should throw BadRequestException when trying to reduce brake fluid stock below zero', async () => {
      // Arrange
      const criticalStockPart = {
        ...brakeFluidPart,
        quantity: 2,
        isLowStock: jest.fn().mockReturnValue(true),
        updateStock: jest.fn(),
        hasStock: jest.fn().mockReturnValue(true),
      } as any;
      const updateStockDto: UpdateStockDto = {
        quantity: -5,
      };
      repository.findById.mockResolvedValue(criticalStockPart);

      // Act & Assert
      await expect(useCase.execute('brake-fluid-001')).rejects.toThrow(BadRequestException);
      expect(repository.findById).toHaveBeenCalledWith('brake-fluid-001');
      expect(
    });
  });
});

