import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';
import { RegisterVehicleService } from '../application/services/register-vehicle.service';
import {
  VEHICLE_REPOSITORY,
  VehicleTypeOrmRepository,
} from '../infrastructure/repositories/vehicle.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [
    RegisterVehicleService,
    { provide: VEHICLE_REPOSITORY, useClass: VehicleTypeOrmRepository },
  ],
  exports: [],
})
export class VehiclesModule {}
