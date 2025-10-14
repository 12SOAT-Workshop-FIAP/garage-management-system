import { CustomerEntity } from '../customer.entity';
import { Customer } from '../../domain/entities/customer.entity';

/**
 * CustomerMapper
 * Maps between domain entities and infrastructure entities
 *
 * IMPORTANT: Document encryption/decryption happens in the repository layer,
 * not in the mapper. The mapper receives and returns plain documents from/to domain.
 */
export class CustomerMapper {
  /**
   * Maps from infrastructure entity to domain entity
   * @param entity - Infrastructure entity (with encrypted document)
   * @param decryptedDocument - Plain document value (already decrypted by repository)
   */
  static toDomain(entity: CustomerEntity, decryptedDocument?: string): Customer {
    return Customer.restore({
      id: entity.id,
      name: entity.name,
      personType: entity.personType,
      document: decryptedDocument || entity.document, // Use decrypted if provided
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
   * @param domain - Domain entity (with plain document)
   * @param encryptedDocument - Encrypted document value (already encrypted by repository)
   */
  static toInfrastructure(domain: Customer, encryptedDocument?: string): Partial<CustomerEntity> {
    return {
      id: domain.id?.value,
      name: domain.name.value,
      personType: domain.personType.value,
      document: encryptedDocument || domain.document.value, // Use encrypted if provided
      phone: domain.phone.value,
      email: domain.email?.value,
      status: domain.status.value,
      // Note: Vehicle IDs handled separately
    };
  }

  /**
   * Maps from domain entity to infrastructure entity for updates
   * @param domain - Domain entity (with plain document)
   * @param encryptedDocument - Encrypted document value (already encrypted by repository)
   */
  static toInfrastructureUpdate(
    domain: Customer,
    encryptedDocument?: string,
  ): Partial<CustomerEntity> {
    return {
      name: domain.name.value,
      personType: domain.personType.value,
      document: encryptedDocument || domain.document.value, // Use encrypted if provided
      phone: domain.phone.value,
      email: domain.email?.value,
      status: domain.status.value,
      updatedAt: domain.updatedAt,
    };
  }
}
