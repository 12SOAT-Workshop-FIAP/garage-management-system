import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { CreateVehicleDto } from '../application/dtos/create-vehicle.dto';
import { Vehicle } from '../domain/vehicle.entity';

describe('CreateVehicleService', () => {
  let service: CreateVehicleService;
  let repo: jest.Mocked<VehicleRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<VehicleRepository> = {
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleService,
        { provide: VehicleRepository, useValue: repoMock }, 
      ],
    }).compile();

    service = module.get(CreateVehicleService);
    repo = module.get(VehicleRepository);
  });

  it('deve criar um veículo corretamente', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Fiat',
      model: 'Uno',
      plate: 'AAA-1234',
      year: 2010,
      customer_id: 123,
    };

    const expectedVehicle: Vehicle = {
      id: 1,
      brand: dto.brand,
      model: dto.model,
      plate: dto.plate,
      year: dto.year,
      customer: { id: dto.customer_id } as any,
      created_at: new Date(),
      customer_id: 0
    };

    repo.create.mockResolvedValue(expectedVehicle);

    const result = await service.execute(dto);

    expect(repo.create).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(expectedVehicle);
  });
});
