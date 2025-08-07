import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsModule } from './modules/parts/parts.module';
import { CustomersModule } from './modules/customers/presentation/customers.module';
import { ServicesModule } from './modules/services/services.module';
import { VehiclesModule } from './modules/vehicles/presentation/vehicles.module';
import { WorkOrdersModule } from './modules/work-orders/presentation/work-orders.module';
import { ConfigModule } from '@nestjs/config';
import { ormconfig } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    CustomersModule,
    VehiclesModule,
    WorkOrdersModule,
    ServicesModule,
    PartsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
