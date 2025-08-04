import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../ormconfig';
import { CustomersModule } from './modules/customers/presentation/customers.module';
import { VehiclesModule } from './modules/vehicles/presentation/vehicles.module';
import { WorkOrdersModule } from './modules/work-orders/presentation/work-orders.module';
import { CryptographyModule } from './modules/cryptography/presentation/cryptography.module';
import { ServicesModule } from './modules/services/services.module';
import { PartsModule } from './modules/parts/presentation/parts.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';

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
    CryptographyModule,
    UsersModule,
    // ... other modules
  ],
})
export class AppModule { }
