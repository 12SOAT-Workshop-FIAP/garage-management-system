import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { PartsModule } from './modules/parts/parts.module';
import { ServicesModule } from './modules/services/services.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { WorkOrdersModule } from './modules/work-orders/presentation/work-orders.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ormconfig } from '../ormconfig';
import { CustomersModule } from '@modules/customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    CustomersModule,
    VehiclesModule,
    WorkOrdersModule,
    ServicesModule,
    PartsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
