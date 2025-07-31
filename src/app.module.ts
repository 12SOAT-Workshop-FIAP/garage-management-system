import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../ormconfig';
import { CustomersModule } from './modules/customers/presentation/customers.module';
import { VehiclesModule } from './modules/vehicles/presentation/vehicles.module';
import { WorkOrdersModule } from './modules/work-orders/presentation/work-orders.module';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    CustomersModule,
    VehiclesModule,
    WorkOrdersModule,
    ServicesModule,
    // ... other modules
  ],
})
export class AppModule {}
