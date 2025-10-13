import { Module } from '@nestjs/common';
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.usecase';
import { VehicleRepositoryAdapter } from '../infrastructure/repositories/vehicle.repository.adapter';
import { CustomerRepositoryAdapter } from '../infrastructure/repositories/customer.repository.adapter';
import { VEHICLE_REPOSITORY, CUSTOMER_REPOSITORY } from '../domain/ports/tokens';
import { VehiclesController } from './controllers/vehicle.controller';
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.usecase';
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.usecase';
import { FindAllVehiclesUseCase } from '../application/use-cases/find-all-vehicles.usecase';
import { DeleteVehicleUseCase } from '../application/use-cases/delete-vehicle.usecase';
import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';

@Module({
  controllers: [VehiclesController],

  providers: [
    // Ports -> Adapters

    { provide: VEHICLE_REPOSITORY, useClass: VehicleRepositoryAdapter },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryAdapter },

    // Use cases

    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    FindVehicleByIdUseCase,
    FindAllVehiclesUseCase,
    DeleteVehicleUseCase,
  ],

  exports: [
    // exporte se outros módulos precisarem

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
