import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/customer.entity';
import { CustomerHttpAdapter } from './infrastructure/adapters/http/customer-http.adapter';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';
import { FindCustomerByIdUseCase } from './application/use-cases/find-customer-by-id.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { FindAllCustomersUseCase } from './application/use-cases/find-all-customers.use-case';
import { CustomerRepository } from './domain/repositories/customer.repository';
import { CustomerTypeOrmRepository } from './infrastructure/customer.typeorm.repository';
import { CryptographyPort } from './domain/ports/cryptography.port';
import { CryptographyAdapter } from './infrastructure/adapters/cryptography/cryptography.adapter';
import { CryptographyModule } from '@modules/cryptography/presentation/cryptography.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), CryptographyModule],
  controllers: [CustomerHttpAdapter],
  providers: [
    // Use Cases
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    FindCustomerByIdUseCase,
    FindCustomerByDocumentUseCase,
    FindAllCustomersUseCase,
    // Ports and Adapters
    { provide: CustomerRepository, useClass: CustomerTypeOrmRepository },
    { provide: CryptographyPort, useClass: CryptographyAdapter },
  ],
  exports: [
    FindCustomerByDocumentUseCase,
    { provide: CustomerRepository, useClass: CustomerTypeOrmRepository },
  ],
})
export class CustomersModule {}
