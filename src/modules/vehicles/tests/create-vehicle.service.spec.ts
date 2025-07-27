// src/modules/vehicles/tests/create-vehicle.service.spec.ts
import { Test, TestingModule }  from '@nestjs/testing';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { VehicleRepository }    from '../domain/vehicle.repository';
import { CreateVehicleDto }     from '../application/dtos/create-vehicle.dto';
import { Vehicle }              from '../domain/vehicle.entity';



describe('CreateVehicleService (unit)', () => {
  let service: CreateVehicleService;
  let repo: jest.Mocked<VehicleRepository>;

  beforeEach(async () => {
    // cria um “fake” do repositório
    const repoProvider = {
      provide: 'VehicleRepository',
      useValue: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateVehicleService, repoProvider],
    }).compile();

    service = module.get<CreateVehicleService>(CreateVehicleService);
    repo = module.get('VehicleRepository');
  });

  it('should create a vehicle and return it', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Ford',
      model: 'Focus',
      plate: 'ZZZ-9999',
      year: 2015,
      customer_id: 'some-uuid',
    };

const fakeVehicle = Object.assign(new Vehicle(), 
{
  id: 'generated-uuid',
  brand: dto.brand,
  model: dto.model,
  plate: dto.plate,
  year: dto.year,
  customer_id: dto.customer_id,
  created_at: new Date(),
});

    repo.create.mockResolvedValue(fakeVehicle);

    const result = await service.execute(dto);
    expect(repo.create).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(fakeVehicle);
  });
});
