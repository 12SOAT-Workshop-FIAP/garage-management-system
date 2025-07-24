import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleController } from './controllers/vehicle.controller';
// import { RegisterVehicleService } from '../application/services/register-vehicle.service';
import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [FindAllVehicleService],
  exports: [],
})
export class VehiclesModule {}
