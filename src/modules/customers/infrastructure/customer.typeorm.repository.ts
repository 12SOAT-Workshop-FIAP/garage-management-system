import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerRepository } from '../domain/repositories/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@modules/customers/domain/entities/customer.entity';
import { CustomerMapper } from './mappers/customer.mapper';
import { CryptographyPort } from '../domain/ports/cryptography.port';

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
    @Inject(CryptographyPort)
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async findAll(): Promise<CustomerEntity[] | null> {
    const entities = await this.repository.find({
      where: { status: true },
      order: {
        id: 'ASC',
      },
    });
    // return entities.map(CustomerMapper.toDomain);
    return entities;
  }

  async findById(id: number): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) return null;

    // Decrypt document before mapping to domain
    const documentType = entity.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
    const decryptedDocumentVo = await this.cryptographyPort.decryptSensitiveData(
      entity.document,
      documentType,
    );

    return CustomerMapper.toDomain(entity, decryptedDocumentVo.value);
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { document },
    });

    if (!entity) return null;

    // Decrypt document before mapping to domain
    const documentType = entity.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
    const decryptedDocumentVo = await this.cryptographyPort.decryptSensitiveData(
      entity.document,
      documentType,
    );

    return CustomerMapper.toDomain(entity, decryptedDocumentVo.value);
  }

  async create(customer: Customer): Promise<Customer> {
    // Encrypt document before persisting
    const documentType = customer.document.type;
    const encryptedDocumentVo = await this.cryptographyPort.encryptSensitiveData(
      customer.document.value,
      documentType,
    );

    const entityData = CustomerMapper.toInfrastructure(
      customer,
      encryptedDocumentVo.encryptedValue,
    );
    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);

    // Decrypt for returning domain entity
    const decryptedDocumentVo = await this.cryptographyPort.decryptSensitiveData(
      savedEntity.document,
      documentType,
    );

    return CustomerMapper.toDomain(savedEntity, decryptedDocumentVo.value);
  }

  async update(oldCustomer: Customer, newCustomer: Customer): Promise<Customer | null> {
    // Encrypt document before persisting
    const documentType = newCustomer.document.type;
    const encryptedDocumentVo = await this.cryptographyPort.encryptSensitiveData(
      newCustomer.document.value,
      documentType,
    );

    const entityData = CustomerMapper.toInfrastructureUpdate(
      newCustomer,
      encryptedDocumentVo.encryptedValue,
    );
    const result = await this.repository.update(oldCustomer.id?.value || 0, entityData);

    if (result.affected === 0) {
      return null;
    }

    return newCustomer; // Return domain entity (already has plain document)
  }

  async delete(customer: Customer): Promise<void> {
    customer.deactivate();
    await this.update(customer, customer);
  }
}
