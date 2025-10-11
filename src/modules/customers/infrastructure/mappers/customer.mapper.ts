import { CustomerEntity } from '../customer.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerId } from '../../domain/value-objects/customer-id.vo';
import { CustomerName } from '../../domain/value-objects/customer-name.vo';
import { PersonType } from '../../domain/value-objects/person-type.vo';
import { Document } from '../../domain/value-objects/document.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Phone } from '../../domain/value-objects/phone.vo';
import { CustomerStatus } from '../../domain/value-objects/customer-status.vo';

/**
 * CustomerMapper
 * Maps between domain entities and infrastructure entities
 */
export class CustomerMapper {
  /**
   * Maps from infrastructure entity to domain entity
   */
  static toDomain(entity: CustomerEntity): Customer {
    return Customer.restore({
      id: entity.id,
      name: entity.name,
      personType: entity.personType,
      document: entity.document,
      phone: entity.phone,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      status: entity.status,
      vehicleIds: [], // Note: Vehicle IDs handled separately
    });
  }

  /**
   * Maps from domain entity to infrastructure entity
   */
  static toInfrastructure(domain: Customer): Partial<CustomerEntity> {
    return {
      id: domain.id?.value,
      name: domain.name.value,
      personType: domain.personType.value,
      document: domain.document.value,
      phone: domain.phone.value,
      email: domain.email?.value,
      status: domain.status.value,
      // Note: Vehicle IDs handled separately
    };
  }

  /**
   * Maps from domain entity to infrastructure entity for updates
   */
  static toInfrastructureUpdate(domain: Customer): Partial<CustomerEntity> {
    return {
      name: domain.name.value,
      personType: domain.personType.value,
      document: domain.document.value,
      phone: domain.phone.value,
      email: domain.email?.value,
      status: domain.status.value,
      updatedAt: domain.updatedAt,
    };
  }
}
