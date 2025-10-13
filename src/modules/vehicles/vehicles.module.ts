import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.usecase';
import { VehicleTypeOrmRepository } from './infrastructure/adapters/repositories/vehicle-typeorm.repository';
import { CustomerRepositoryAdapter } from './infrastructure/repositories/customer.repository.adapter';
import { VEHICLE_REPOSITORY, CUSTOMER_REPOSITORY } from './domain/ports/tokens';
import { VehicleHttpAdapter } from './infrastructure/adapters/http/vehicle-http.adapter';
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle.usecase';
import { FindVehicleByIdUseCase } from './application/use-cases/find-vehicle-by-id.usecase';
import { FindAllVehiclesUseCase } from './application/use-cases/find-all-vehicles.usecase';
import { DeleteVehicleUseCase } from './application/use-cases/delete-vehicle.usecase';
import { VehicleOrmEntity } from './infrastructure/entities/vehicle-orm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleOrmEntity])],
  controllers: [VehicleHttpAdapter],
  providers: [
    // Ports -> Adapters
    { provide: VEHICLE_REPOSITORY, useClass: VehicleTypeOrmRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryAdapter },

    // Use cases
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    FindVehicleByIdUseCase,
    FindAllVehiclesUseCase,
    DeleteVehicleUseCase,
  ],
  exports: [
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    FindVehicleByIdUseCase,
    FindAllVehiclesUseCase,
    DeleteVehicleUseCase,
    VEHICLE_REPOSITORY,
    CUSTOMER_REPOSITORY,
  ],
})
export class VehiclesModule {}
