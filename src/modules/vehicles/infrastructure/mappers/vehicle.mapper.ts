import { Vehicle } from '../../domain/entities/vehicle';
import { VehicleOrmEntity } from '../entities/vehicle-orm.entity';

export class VehicleMapper {
  static toDomain(ormEntity: VehicleOrmEntity): Vehicle {
    return Vehicle.restore(ormEntity.id, {
      plate: { value: ormEntity.plate } as any, // Plate value object
      brand: ormEntity.brand,
      model: ormEntity.model,
      year: ormEntity.year,
      customerId: ormEntity.customerId,
    });
  }

  static toOrm(domainEntity: Vehicle): VehicleOrmEntity {
    const ormEntity = new VehicleOrmEntity();

    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }

    ormEntity.brand = domainEntity.brand;
    ormEntity.model = domainEntity.model;
    ormEntity.plate = domainEntity.plate.value;
    ormEntity.year = domainEntity.year;
    ormEntity.customerId = domainEntity.customerId;

    return ormEntity;
  }

  static toDomainList(ormEntities: VehicleOrmEntity[]): Vehicle[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }
}
