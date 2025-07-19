import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../domain/customer.entity';
import { CustomerController } from './controllers/customer.controller';
import { CreateCustomerService } from '../application/services/create-customer.service';
import { CustomerTypeOrmRepository } from '../infrastructure/repositories/customer.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [
    CreateCustomerService,
    { provide: 'CustomerRepository', useClass: CustomerTypeOrmRepository },
  ],
  exports: [],
})
export class CustomersModule {}
