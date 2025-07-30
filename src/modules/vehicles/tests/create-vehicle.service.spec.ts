import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common'; // Para testes de exceção

// Importações dos DTOs
import { CreateVehicleDto } from '../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../application/dtos/update-vehicle.dto';

// Importações dos SERVIÇOS
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';

// Importações das Entidades/Repositórios
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleRepository } from '../domain/vehicle.repository'; // Importe a interface do repositório


describe('Vehicle Application Services (Unit Tests)', () => {
  let createService: CreateVehicleService;
  let updateService: UpdateVehicleService;
  let deleteService: DeleteVehicleService;
  let findAllService: FindAllVehicleService;
  let findByIdService: FindByIdVehicleService;
  let repo: jest.Mocked<any>; 


  // Um veículo de exemplo para usar em vários testes
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
      provide: 'VehicleRepository', // Seu token de injeção
      useValue: {
        // Métodos do TypeORM Repository<Vehicle> que os serviços chamam
        find: jest.fn(),    // Chamado por FindAllVehicleService
        findOne: jest.fn(), // Chamado por FindByIdVehicleService
        preload: jest.fn(), // Chamado por UpdateVehicleService
        save: jest.fn(),    // Chamado por CreateVehicleService e UpdateVehicleService
        delete: jest.fn(),  // Chamado por DeleteVehicleService
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleService,
        UpdateVehicleService,
        DeleteVehicleService,
        FindAllVehicleService,
        FindByIdVehicleService,
        repoProvider,
      ],
    }).compile();

    createService = module.get<CreateVehicleService>(CreateVehicleService);
    updateService = module.get<UpdateVehicleService>(UpdateVehicleService);
    deleteService = module.get<DeleteVehicleService>(DeleteVehicleService);
    findAllService = module.get<FindAllVehicleService>(FindAllVehicleService);
    findByIdService = module.get<FindByIdVehicleService>(FindByIdVehicleService);
    // Aqui, 'repo' obterá a instância com os mocks definidos acima
    repo = module.get('VehicleRepository');
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

      repo.save.mockResolvedValue(expectedVehicle);

      const result = await createService.execute(dto);

      // Verifique se 'save' foi chamado
      expect(repo.save).toHaveBeenCalledWith(expect.any(Vehicle)); 
      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedVehicle);
    });
  });

  // --- Testes para FindByIdVehicleService ---
  describe('FindByIdVehicleService', () => {
    it('should find a vehicle by ID and return it', async () => {
      // FindByIdVehicleService.execute chama 'this.ormRepo.findOne'
      repo.findOne.mockResolvedValue(fakeVehicle); // MOCKAR findOne diretamente

      const result = await findByIdService.execute(mockVehicleId);

      // Verificar chamada de 'findOne'
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: mockVehicleId },
        relations: ['customer'],
      });
      expect(result).toEqual(fakeVehicle);
    });

    it('should throw NotFoundException if vehicle not found by ID', async () => {
      // FindByIdVehicleService.execute chama 'this.ormRepo.findOne'
      repo.findOne.mockResolvedValue(null); // MOCKAR findOne para retornar null

      await expect(findByIdService.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
        relations: ['customer'],
      });
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

      // FindAllVehicleService.execute chama 'this.ormRepo.find'
      repo.find.mockResolvedValue(vehiclesList); // MOCKAR find diretamente

      const result = await findAllService.execute();

      // Verificar chamada de 'find'
      expect(repo.find).toHaveBeenCalledWith({ relations: ['customer'] });
      expect(result).toEqual(vehiclesList);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no vehicles are found', async () => {
      // FindAllVehicleService.execute chama 'this.ormRepo.find'
      repo.find.mockResolvedValue([]); // MOCKAR find para retornar array vazio

      const result = await findAllService.execute();

      // Verificar chamada de 'find'
      expect(repo.find).toHaveBeenCalledWith({ relations: ['customer'] });
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
      // UpdateVehicleService chama 'this.ormRepo.preload' e 'this.ormRepo.save'
      const updatedFakeVehicle = { ...fakeVehicle, ...updateDto, updated_at: new Date() };

      // Mocka o preload para retornar o veículo atualizado
      repo.preload.mockResolvedValue(updatedFakeVehicle); // MOCKAR preload
      repo.save.mockResolvedValue(updatedFakeVehicle); // MOCKAR save

      const result = await updateService.execute(mockVehicleId, updateDto);

      // Asserções
      expect(repo.preload).toHaveBeenCalledWith({ id: mockVehicleId, ...updateDto });
      expect(repo.save).toHaveBeenCalledWith(updatedFakeVehicle);
      expect(result).toEqual(updatedFakeVehicle);
    });

    it('should throw NotFoundException if vehicle to update does not exist', async () => {
      // UpdateVehicleService chama 'this.ormRepo.preload'
      // Mockamos preload para retornar null, simulando que o veículo não foi encontrado
      repo.preload.mockResolvedValue(null);

      await expect(updateService.execute('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
      expect(repo.preload).toHaveBeenCalledWith({ id: 'non-existent-id', ...updateDto });
    });
  });

  // --- Testes para DeleteVehicleService ---
  describe('DeleteVehicleService', () => {
    it('should delete a vehicle successfully', async () => {
      // DeleteVehicleService usa 'this.ormRepo.delete'
      // Mocka o método 'delete' do TypeORM para retornar um objeto com 'affected: 1'
      repo.delete.mockResolvedValue({ affected: 1 });

      await deleteService.execute(mockVehicleId);

      // Verifique a chamada do método 'delete' com o ID
      expect(repo.delete).toHaveBeenCalledWith(mockVehicleId);
      expect(repo.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if vehicle to delete does not exist', async () => {
      // DeleteVehicleService usa 'this.ormRepo.delete'
      // Mocka o método 'delete' do TypeORM para retornar um objeto com 'affected: 0'
      repo.delete.mockResolvedValue({ affected: 0 });

      await expect(deleteService.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});