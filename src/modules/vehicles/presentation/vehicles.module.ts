import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';

// Importação dos serviços de aplicação
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';

// Importação da implementação do repositório TypeORM
// CORREÇÃO AQUI: Ajustado para 'vehicle-typeorm.repository' conforme sua estrutura.
import { TypeOrmVehicleRepository } from '../infrastructure/vehicle-typeorm.repository';

// IMPORTAÇÃO DA INTERFACE VehicleRepository (necessária para tipagem em 'exports')
import { VehicleRepository } from '../domain/vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [
    CreateVehicleService,
    FindAllVehicleService,
    UpdateVehicleService,
    DeleteVehicleService,
    FindByIdVehicleService,

    {
      provide: VehicleRepository,
      useClass: TypeOrmVehicleRepository,
    },
  ],
  exports: [],
})
export class VehiclesModule {}
