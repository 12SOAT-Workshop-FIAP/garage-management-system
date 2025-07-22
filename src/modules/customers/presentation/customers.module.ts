import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../domain/customer.entity';
import { CustomerController } from './controllers/customer.controller';
import { CreateCustomerService } from '../application/services/create-customer.service';
import {
  CUSTOMER_REPOSITORY,
  CustomerTypeOrmRepository,
} from '../infrastructure/repositories/customer.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [
    CreateCustomerService,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerTypeOrmRepository },
  ],
  exports: [],
})
export class CustomersModule {}
