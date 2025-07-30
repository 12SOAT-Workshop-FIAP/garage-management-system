import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

// Importações dos DTOs
import { CreateVehicleDto } from '../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../application/dtos/update-vehicle.dto';

// Importações dos SERVIÇOS (agora todos injetam VehicleRepository)
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';

// Importação da INTERFACE do Repositório (apenas para tipagem do mock)
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';


describe('Vehicle Application Services (Unit Tests)', () => {
  let createService: CreateVehicleService;
  let updateService: UpdateVehicleService;
  let deleteService: DeleteVehicleService;
  let findAllService: FindAllVehicleService;
  let findByIdService: FindByIdVehicleService;
  let repo: jest.Mocked<VehicleRepository>;


  const mockVehicleId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const mockCustomerId = 456;
  const fakeVehicle = Object.assign(new Vehicle(), {
    id: mockVehicleId,
    brand: 'Fiat',
    model: 'Palio',
    plate: 'ABC-1234',
    year: 2010,
    customer_id: mockCustomerId,
    created_at: new Date(),
    updated_at: new Date(),
  });

  beforeEach(async () => {
    const repoProvider = {
      provide: 'VehicleRepository', // Continua sendo o token de injeção
      useValue: {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        findByPlate: jest.fn(), // Ver com o Fabricio se precico criar na SERVICE o findByPlate
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleService,
        UpdateVehicleService,
        DeleteVehicleService,
        FindAllVehicleService,
        FindByIdVehicleService,
        repoProvider, // Nosso mock do repositório
      ],
    }).compile();

    createService = module.get<CreateVehicleService>(CreateVehicleService);
    updateService = module.get<UpdateVehicleService>(UpdateVehicleService);
    deleteService = module.get<DeleteVehicleService>(DeleteVehicleService);
    findAllService = module.get<FindAllVehicleService>(FindAllVehicleService);
    findByIdService = module.get<FindByIdVehicleService>(FindByIdVehicleService);
    repo = module.get('VehicleRepository'); // Obtemos a instância mockada da interface VehicleRepository
  });

  // --- Testes para CreateVehicleService ---
  describe('CreateVehicleService', () => {
    it('should create a vehicle and return it', async () => {
      const dto: CreateVehicleDto = {
        brand: 'Ford',
        model: 'Focus',
        plate: 'ZZZ-9999',
        year: 2015,
        customer_id: 123,
      };

      const expectedVehicle = Object.assign(new Vehicle(), {
        id: 'new-generated-uuid',
        brand: dto.brand,
        model: dto.model,
        plate: dto.plate,
        year: dto.year,
        customer_id: dto.customer_id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      repo.create.mockResolvedValue(expectedVehicle);

      const result = await createService.execute(dto);

      expect(repo.create).toHaveBeenCalledWith(expect.any(Vehicle));
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedVehicle);
    });
  });

  // --- Testes para FindByIdVehicleService ---
  describe('FindByIdVehicleService', () => {
    it('should find a vehicle by ID and return it', async () => {
      repo.findById.mockResolvedValue(fakeVehicle);

      const result = await findByIdService.execute(mockVehicleId);

      expect(repo.findById).toHaveBeenCalledWith(mockVehicleId);
      expect(result).toEqual(fakeVehicle);
    });

    it('should throw NotFoundException if vehicle not found by ID', async () => {
      repo.findById.mockResolvedValue(null); // findById pode retornar null para não encontrado

      await expect(findByIdService.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  // --- Testes para FindAllVehicleService ---
  describe('FindAllVehicleService', () => {
    it('should return an array of vehicles', async () => {
      const anotherFakeVehicle = Object.assign(new Vehicle(), {
        id: 'another-id',
        brand: 'Honda',
        model: 'Civic',
        plate: 'DEF-5678',
        year: 2020,
        customer_id: 789,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const vehiclesList = [fakeVehicle, anotherFakeVehicle];

      repo.findAll.mockResolvedValue(vehiclesList);

      const result = await findAllService.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(vehiclesList);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no vehicles are found', async () => {
      repo.findAll.mockResolvedValue([]);

      const result = await findAllService.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // --- Testes para UpdateVehicleService ---
  describe('UpdateVehicleService', () => {
    const updateDto: UpdateVehicleDto = {
      model: 'Focus RS',
      year: 2018,
    };

    it('should update a vehicle and return the updated vehicle', async () => {
      const updatedFakeVehicle = { ...fakeVehicle, ...updateDto, updated_at: new Date() };

      // UpdateVehicleService agora chama repo.findById() e repo.update()
      repo.findById.mockResolvedValue(fakeVehicle); // Busca o veículo existente
      repo.update.mockResolvedValue(updatedFakeVehicle); // Retorna o veículo atualizado

      const result = await updateService.execute(mockVehicleId, updateDto);

      expect(repo.findById).toHaveBeenCalledWith(mockVehicleId);
      expect(repo.update).toHaveBeenCalledWith(mockVehicleId, updateDto); // <--- CORREÇÃO AQUI: 'dto' para 'updateDto'
      expect(result).toEqual(updatedFakeVehicle);
    });

    it('should throw NotFoundException if vehicle to update does not exist', async () => {
      // UpdateVehicleService agora chama repo.findById()
      repo.findById.mockResolvedValue(null); // findById retorna null para não encontrado

      await expect(updateService.execute('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repo.update).not.toHaveBeenCalled(); // Update não deve ser chamado
    });
  });

  // --- Testes para DeleteVehicleService ---
  describe('DeleteVehicleService', () => {
    it('should delete a vehicle successfully', async () => {
      // DeleteVehicleService agora chama repo.findById() e repo.delete()
      repo.findById.mockResolvedValue(fakeVehicle); // Busca o veículo existente
      repo.delete.mockResolvedValue(undefined); // delete retorna void/undefined para sucesso

      await deleteService.execute(mockVehicleId);

      expect(repo.findById).toHaveBeenCalledWith(mockVehicleId);
      expect(repo.delete).toHaveBeenCalledWith(mockVehicleId);
      expect(repo.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if vehicle to delete does not exist', async () => {
      // DeleteVehicleService agora chama repo.findById()
      repo.findById.mockResolvedValue(null); // findById retorna null para não encontrado

      await expect(deleteService.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repo.delete).not.toHaveBeenCalled(); // Delete não deve ser chamado
    });
  });
});