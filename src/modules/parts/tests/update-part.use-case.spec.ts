import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException, ConflictException } from '@nestjs/common';import { NotFoundException, ConflictException } from '@nestjs/common';

import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case';import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case';

import { PartRepository } from '../domain/repositories/part.repository';import { PartRepository } from '../domain/repositories/part.repository';

import { Part } from '../domain/entities/part.entity';import { Part } from '../domain/entities/part.entity';

import { UpdatePartDto } from '../application/dtos/update-part.dto';import { UpdatePartDto } from '../application/dtos/update-part.dto';



describe('UpdatePartUseCase', () => {

  let useCase: UpdatePartUseCase;describe('UpdatePartUseCase', () => {

  let repository: jest.Mocked<PartRepository>;  let useCase: UpdatePartUseCase;

  let repository: jest.Mocked<PartRepository>;

  const mockPartRepository = {

    findById: jest.fn(),  const mockPartRepository = {

    findAll: jest.fn(),    findById: jest.fn(),

    findByPartNumber: jest.fn(),    findAll: jest.fn(),

    findByCategory: jest.fn(),    findByPartNumber: jest.fn(),

    findLowStockParts: jest.fn(),    findByCategory: jest.fn(),

    create: jest.fn(),    findLowStockParts: jest.fn(),

    update: jest.fn(),    save: jest.fn(),

    delete: jest.fn(),    delete: jest.fn(),

    updateStock: jest.fn(),    count: jest.fn(),

  };  };



  beforeEach(async () => {  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({    const module: TestingModule = await Test.createTestingModule({

      providers: [      providers: [

        UpdatePartUseCase,        UpdatePartUseCase,

        {        {

          provide: PartRepository,          provide: PartRepository,

          useValue: mockPartRepository,          useValue: mockPartRepository,

        },        },

      ],      ],

    }).compile();    }).compile();



    useCase = module.get<UpdatePartUseCase>(UpdatePartUseCase);    useCase = module.get<UpdatePartUseCase>(UpdatePartUseCase);

    repository = module.get(PartRepository);    repository = module.get(PartRepository);

  });  });



  afterEach(() => {  afterEach(() => {

    jest.clearAllMocks();    jest.clearAllMocks();

  });  });



  describe('execute', () => {  describe('execute', () => {

    it('should update oil filter price successfully', async () => {    const existingOilFilter: Part = {

      // Arrange      id: 'filter-oil-001',

      const existingOilFilter = Part.create({      name: 'Filtro de Óleo do Motor',

        name: 'Filtro de Óleo do Motor',      description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',

        description: 'Filtro de óleo para motores 1.0 a 2.0 16V - VW/Ford/GM',      partNumber: 'FO-1620-VW',

        partNumber: 'FO-1620-VW',      category: 'filtros',

        category: 'filtros',      price: 45.90,

        price: 45.90,      costPrice: 32.15,

        costPrice: 32.15,      stockQuantity: 25,

        stockQuantity: 25,      minStockLevel: 5,

        minStockLevel: 5,      unit: 'piece',

        unit: 'PC',      supplier: 'Auto Peças Central Ltda',

        supplier: 'Auto Peças Central Ltda',      active: true,

      });    } as Part;



      const updateDto: UpdatePartDto = {    it('should update oil filter price successfully', async () => {

        price: 52.50,      // Arrange

        costPrice: 36.75,      const updateDto: UpdatePartDto = {

      };        price: 52.50,

        costPrice: 36.75,

      repository.findById.mockResolvedValue(existingOilFilter);      };

      repository.update.mockResolvedValue(existingOilFilter);

      repository.findById.mockResolvedValue(existingOilFilter);

      // Act      const updatedPart = { ...existingOilFilter, ...updateDto } as Part;

      const result = await useCase.execute(1, updateDto);      repository.update.mockResolvedValue(updatedPart);



      // Assert      // Act

      expect(repository.findById).toHaveBeenCalledWith(1);      const result = await useCase.execute('filter-oil-001', updateDto);

      expect(repository.update).toHaveBeenCalled();

      expect(result).toBeDefined();      // Assert

    });      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');

      expect(repository.update).toHaveBeenCalledWith(

    it('should update brake pad description and category', async () => {        expect.objectContaining({

      // Arrange          price: 52.50,

      const existingBrakePad = Part.create({          costPrice: 36.75,

        name: 'Pastilha de Freio Dianteira',        })

        description: 'Pastilha de freio para VW Gol/Voyage G5-G6',      );

        partNumber: 'PF-5570-VW',      expect(result).toEqual(updatedPart);

        category: 'freios',    });

        price: 89.50,

        costPrice: 62.65,    it('should update brake pad description and category', async () => {

        stockQuantity: 12,      // Arrange

        minStockLevel: 3,      const existingBrakePad: Part = {

        unit: 'SET',        id: 'brake-pad-001',

        supplier: 'Freios & Cia Distribuidora',        name: 'Pastilha de Freio Dianteira',

      });        description: 'Pastilha de freio para VW Gol/Voyage G5-G6',

        partNumber: 'PF-5570-VW',

      const updateDto: UpdatePartDto = {        category: 'freios',

        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',        price: 89.50,

        category: 'sistema-freios',      } as Part;

      };

      const updateDto: UpdatePartDto = {

      repository.findById.mockResolvedValue(existingBrakePad);        description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',

      repository.update.mockResolvedValue(existingBrakePad);        category: 'sistema-freios',

      };

      // Act

      const result = await useCase.execute(2, updateDto);      repository.findById.mockResolvedValue(existingBrakePad);

      const updatedPart = { ...existingBrakePad, ...updateDto } as Part;

      // Assert      repository.update.mockResolvedValue(updatedPart);

      expect(repository.findById).toHaveBeenCalledWith(2);

      expect(repository.update).toHaveBeenCalled();      // Act

      expect(result).toBeDefined();      const result = await useCase.execute('brake-pad-001', updateDto);

    });

      // Assert

    it('should throw NotFoundException when part does not exist', async () => {      expect(repository.findById).toHaveBeenCalledWith('brake-pad-001');

      // Arrange      expect(repository.update).toHaveBeenCalledWith(

      const updateDto: UpdatePartDto = {        expect.objectContaining({

        price: 100.00,          description: 'Pastilha de freio para VW Gol/Voyage G5-G6 - Fras-le Premium',

      };          category: 'sistema-freios',

        })

      repository.findById.mockResolvedValue(null);      );

      expect(result).toEqual(updatedPart);

      // Act & Assert    });

      await expect(useCase.execute(999, updateDto)).rejects.toThrow(NotFoundException);

      expect(repository.findById).toHaveBeenCalledWith(999);    it('should update part number when it does not conflict', async () => {

      expect(repository.update).not.toHaveBeenCalled();      // Arrange

    });      const updateDto: UpdatePartDto = {

        partNumber: 'FO-1620-VW-NEW',

    it('should update hydraulic oil supplier and active status', async () => {      };

      // Arrange

      const hydraulicOil = Part.create({      repository.findById.mockResolvedValue(existingOilFilter);

        name: 'Óleo Hidráulico ATF',      repository.findByPartNumber.mockResolvedValue(null); // No conflict

        description: 'Óleo hidráulico para transmissão automática',      const updatedPart = { ...existingOilFilter, partNumber: 'FO-1620-VW-NEW' } as Part;

        partNumber: 'ATF-001',      repository.update.mockResolvedValue(updatedPart);

        category: 'lubrificantes',

        price: 28.90,      // Act

        costPrice: 21.45,      const result = await useCase.execute('filter-oil-001', updateDto);

        stockQuantity: 15,

        minStockLevel: 5,      // Assert

        unit: 'L',      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');

        supplier: 'Lubricantes S.A.',      expect(repository.findByPartNumber).toHaveBeenCalledWith('FO-1620-VW-NEW');

      });      expect(repository.update).toHaveBeenCalledWith(

        expect.objectContaining({

      const updateDto: UpdatePartDto = {          partNumber: 'FO-1620-VW-NEW',

        supplier: 'Lubrificantes Premium Ltda',        })

        active: false,      );

      };      expect(result).toEqual(updatedPart);

    });

      repository.findById.mockResolvedValue(hydraulicOil);

      repository.update.mockResolvedValue(hydraulicOil);    it('should throw ConflictException when updating to existing part number', async () => {

      // Arrange

      // Act      const updateDto: UpdatePartDto = {

      const result = await useCase.execute(3, updateDto);        partNumber: 'PF-5570-VW',

      };

      // Assert

      expect(repository.findById).toHaveBeenCalledWith(3);      const existingPartWithSameNumber = {

      expect(repository.update).toHaveBeenCalled();        id: 'brake-pad-001',

      expect(result).toBeDefined();        partNumber: 'PF-5570-VW',

    });      } as Part;



    it('should update minimum stock level', async () => {      repository.findById.mockResolvedValue(existingOilFilter);

      // Arrange      repository.findByPartNumber.mockResolvedValue(existingPartWithSameNumber);

      const sparkPlug = Part.create({

        name: 'Vela de Ignição NGK',      // Act & Assert

        description: 'Vela de ignição NGK Laser Platinum',      await expect(useCase.execute('filter-oil-001', updateDto)).rejects.toThrow(ConflictException);

        partNumber: 'NGK-001',      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');

        category: 'ignicao',      expect(repository.findByPartNumber).toHaveBeenCalledWith('PF-5570-VW');

        price: 25.80,      expect(repository.update).not.toHaveBeenCalled();

        costPrice: 18.06,    });

        stockQuantity: 48,

        minStockLevel: 10,    it('should allow updating part number to the same value', async () => {

        unit: 'PC',      // Arrange

        supplier: 'Ignição Total Autopeças',      const updateDto: UpdatePartDto = {

      });        partNumber: 'FO-1620-VW', // Same as existing

        price: 50.00,

      const updateDto: UpdatePartDto = {      };

        minStockLevel: 15,

      };      repository.findById.mockResolvedValue(existingOilFilter);

      repository.findByPartNumber.mockResolvedValue(existingOilFilter); // Same part

      repository.findById.mockResolvedValue(sparkPlug);      const updatedPart = { ...existingOilFilter, price: 50.00 } as Part;

      repository.update.mockResolvedValue(sparkPlug);      repository.update.mockResolvedValue(updatedPart);



      // Act      // Act

      const result = await useCase.execute(4, updateDto);      const result = await useCase.execute('filter-oil-001', updateDto);



      // Assert      // Assert

      expect(repository.findById).toHaveBeenCalledWith(4);      expect(repository.findById).toHaveBeenCalledWith('filter-oil-001');

      expect(repository.update).toHaveBeenCalled();      expect(repository.findByPartNumber).toHaveBeenCalledWith('FO-1620-VW');

      expect(result).toBeDefined();      expect(repository.update).toHaveBeenCalledWith(

    });        expect.objectContaining({

          partNumber: 'FO-1620-VW',

    it('should update unit type', async () => {          price: 50.00,

      // Arrange        })

      const timingBelt = Part.create({      );

        name: 'Correia Dentada',      expect(result).toEqual(updatedPart);

        description: 'Correia dentada para motor 1.0/1.6',    });

        partNumber: 'CTD-001',

        category: 'motor',    it('should throw NotFoundException when part does not exist', async () => {

        price: 120.00,      // Arrange

        costPrice: 85.00,      const updateDto: UpdatePartDto = {

        stockQuantity: 8,        price: 100.00,

        minStockLevel: 3,      };

        unit: 'PC',

        supplier: 'Correias Motors',      repository.findById.mockResolvedValue(null);

      });

      // Act & Assert

      const updateDto: UpdatePartDto = {      await expect(useCase.execute('non-existent-part', updateDto)).rejects.toThrow(NotFoundException);

        unit: 'SET',      expect(repository.findById).toHaveBeenCalledWith('non-existent-part');

      };      expect(repository.update).not.toHaveBeenCalled();

    });

      repository.findById.mockResolvedValue(timingBelt);

      repository.update.mockResolvedValue(timingBelt);    it('should update hydraulic oil supplier and active status', async () => {

      // Arrange

      // Act      const hydraulicOil: Part = {

      const result = await useCase.execute(5, updateDto);        id: 'hydraulic-oil-001',

        name: 'Óleo Hidráulico ATF',

      // Assert        category: 'lubrificantes',

      expect(repository.findById).toHaveBeenCalledWith(5);        price: 28.90,

      expect(repository.update).toHaveBeenCalled();        supplier: 'Antigo Fornecedor',

      expect(result).toBeDefined();        active: true,

    });      } as Part;



    it('should update multiple fields at once', async () => {      const updateDto: UpdatePartDto = {

      // Arrange        supplier: 'Novo Fornecedor Premium',

      const airFilter = Part.create({        active: false,

        name: 'Filtro de Ar',        minStockLevel: 10,

        description: 'Filtro de ar para motor 1.0',      };

        partNumber: 'FA-001',

        category: 'filtros',      repository.findById.mockResolvedValue(hydraulicOil);

        price: 35.00,      const updatedPart = { ...hydraulicOil, ...updateDto } as Part;

        costPrice: 24.50,      repository.update.mockResolvedValue(updatedPart);

        stockQuantity: 20,

        minStockLevel: 5,      // Act

        unit: 'PC',      const result = await useCase.execute('hydraulic-oil-001', updateDto);

        supplier: 'Filtros Auto',

      });      // Assert

      expect(repository.findById).toHaveBeenCalledWith('hydraulic-oil-001');

      const updateDto: UpdatePartDto = {      expect(repository.update).toHaveBeenCalledWith(

        name: 'Filtro de Ar Cabine',        expect.objectContaining({

        description: 'Filtro de ar para cabine - todos os modelos',          supplier: 'Novo Fornecedor Premium',

        price: 42.00,          active: false,

        costPrice: 29.40,          minStockLevel: 10,

        minStockLevel: 8,        })

      };      );

      expect(result).toEqual(updatedPart);

      repository.findById.mockResolvedValue(airFilter);    });

      repository.update.mockResolvedValue(airFilter);  });

});

      // Act

      const result = await useCase.execute(6, updateDto);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(6);
      expect(repository.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
