import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../infrastructure/customer.entity';
import { CustomerController } from './controllers/customer.controller';
import { CreateCustomerService } from '../application/services/create-customer.service';
import { CustomerTypeOrmRepository } from '../infrastructure/customer.typeorm.repository';
import { CustomerRepository } from '../domain/customer.repository';
import { UpdateCustomerService } from '../application/services/update-customer.service';
import { DeleteCustomerService } from '../application/services/delete-customer.service';
import { FindAllCustomerService } from '../application/services/find-all-customer.service';
import { FindOneCustomerService } from '../application/services/find-one-customer.sevice';
import { FindByDocumentCustomerService } from '../application/services/find-by-document-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [
    FindAllCustomerService,
    FindOneCustomerService,
    FindByDocumentCustomerService,
    CreateCustomerService,
    UpdateCustomerService,
    DeleteCustomerService,
    { provide: CustomerRepository, useClass: CustomerTypeOrmRepository },
  ],
  exports: [{ provide: CustomerRepository, useClass: CustomerTypeOrmRepository }],
})
export class CustomersModule {}
