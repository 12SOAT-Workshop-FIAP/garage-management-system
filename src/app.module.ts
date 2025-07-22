import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../ormconfig';
import { CustomersModule } from './modules/customers/presentation/customers.module';
import { VehiclesModule } from './modules/vehicles/presentation/vehicles.module';
import { WorkOrdersModule } from './modules/work-orders/presentation/work-orders.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), CustomersModule, VehiclesModule, WorkOrdersModule],
})
export class AppModule {}
