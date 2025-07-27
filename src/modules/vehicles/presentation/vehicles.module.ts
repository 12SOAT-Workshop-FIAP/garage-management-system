import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { FindVehiclesService } from '../application/services/find-all-vehicle.service';
import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { TypeOrmVehicleRepository } from '../infrastructure/vehicle-typeorm.repository';
import { VehicleRepository } from '../domain/vehicle.repository';



@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [
    CreateVehicleService,
    FindVehiclesService,
    UpdateVehicleService,
    DeleteVehicleService,
    {
      provide: 'VehicleRepository',
      useClass: TypeOrmVehicleRepository,
    },
  ],
})
export class VehiclesModule {}
