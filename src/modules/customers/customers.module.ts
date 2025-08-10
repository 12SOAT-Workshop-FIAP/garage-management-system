import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/customer.entity';
import { CustomerController } from './presentation/controllers/customer.controller';
import { FindAllCustomerService } from './application/services/find-all-customer.service';
import { FindOneCustomerService } from './application/services/find-one-customer.sevice';
import { FindByDocumentCustomerService } from './application/services/find-by-document-customer.service';
import { CreateCustomerService } from './application/services/create-customer.service';
import { UpdateCustomerService } from './application/services/update-customer.service';
import { DeleteCustomerService } from './application/services/delete-customer.service';
import { CustomerRepository } from './domain/customer.repository';
import { CustomerTypeOrmRepository } from './infrastructure/customer.typeorm.repository';
import { CryptographyModule } from '@modules/cryptography/presentation/cryptography.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), CryptographyModule],
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
  exports: [
    FindByDocumentCustomerService,
    { provide: CustomerRepository, useClass: CustomerTypeOrmRepository },
  ],
})
export class CustomersModule {}
