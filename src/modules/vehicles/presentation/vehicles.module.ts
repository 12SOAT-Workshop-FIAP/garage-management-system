import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from '../infrastructure/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { VehicleTypeOrmRepository } from '../infrastructure/vehicle-typeorm.repository';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  controllers: [VehicleController],
  providers: [
    { provide: VehicleRepository, useClass: VehicleTypeOrmRepository },
    FindAllVehicleService,
    CreateVehicleService,
  ],
  exports: [],
})
export class VehiclesModule {}
