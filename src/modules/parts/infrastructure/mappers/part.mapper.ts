import { Part } from '../../domain/entities/part.entity';
import { PartOrmEntity } from '../entities/part-orm.entity';

export class PartMapper {
  static toDomain(ormEntity: PartOrmEntity): Part {
    return Part.restore({
      id: ormEntity.id,
      name: ormEntity.name,
      description: ormEntity.description,
      partNumber: ormEntity.partNumber,
      category: ormEntity.category,
      price: ormEntity.price,
      costPrice: ormEntity.costPrice,
      stockQuantity: ormEntity.stockQuantity,
      minStockLevel: ormEntity.minStockLevel,
      unit: ormEntity.unit,
      supplier: ormEntity.supplier,
      active: ormEntity.active,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrm(domainEntity: Part): PartOrmEntity {
    const ormEntity = new PartOrmEntity();

    if (domainEntity.id) {
      ormEntity.id = domainEntity.id.value;
    }

    ormEntity.name = domainEntity.name.value;
    ormEntity.description = domainEntity.description.value;
    ormEntity.partNumber = domainEntity.partNumber.value;
    ormEntity.category = domainEntity.category.value;
    ormEntity.price = domainEntity.price.value;
    ormEntity.costPrice = domainEntity.costPrice.value;
    ormEntity.stockQuantity = domainEntity.stockQuantity.value;
    ormEntity.minStockLevel = domainEntity.minStockLevel;
    ormEntity.unit = domainEntity.unit.value;
    ormEntity.supplier = domainEntity.supplier.value;
    ormEntity.active = domainEntity.status.value;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;

    return ormEntity;
  }

  static toDomainList(ormEntities: PartOrmEntity[]): Part[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
