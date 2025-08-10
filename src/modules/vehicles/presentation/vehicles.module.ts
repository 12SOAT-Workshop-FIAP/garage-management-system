import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from './controllers/vehicle.controller';

// Importação dos serviços de aplicação
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';
import { FindVehicleByPlateService } from '../application/services/find-vehicle-by-plate.service';

// Importação da implementação do repositório TypeORM
// CORREÇÃO AQUI: Ajustado para 'vehicle-typeorm.repository' conforme sua estrutura.
import { TypeOrmVehicleRepository } from '../infrastructure/vehicle-typeorm.repository';

// IMPORTAÇÃO DA INTERFACE VehicleRepository (necessária para tipagem em 'exports')
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';
import { CustomersModule } from '@modules/customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), CustomersModule],
  controllers: [VehicleController],
  providers: [
    CreateVehicleService,
    FindAllVehicleService,
    UpdateVehicleService,
    DeleteVehicleService,
    FindByIdVehicleService,
    FindVehicleByPlateService,

    {
      provide: VehicleRepository,
      useClass: TypeOrmVehicleRepository,
    },
  ],
  exports: [],
})
export class VehiclesModule {}
