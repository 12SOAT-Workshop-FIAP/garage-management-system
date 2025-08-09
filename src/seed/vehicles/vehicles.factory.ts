import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';

import { Vehicle as VehicleEntity } from '@modules/vehicles/domain/vehicle.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';

export class VehiclesFactory extends Factory<VehicleEntity> {
  protected entity = VehicleEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<VehicleEntity> {
    const brand = faker.vehicle.manufacturer();
    const model = faker.vehicle.model();

    const plate = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.string.numeric(4)}`;

    const currentYear = new Date().getFullYear();
    const year = faker.number.int({ min: 1995, max: currentYear });

    return {
      brand,
      model,
      plate,
      year,
      // Allow seeder to override; default to null-ish to enforce seeder responsibility
      customer: undefined as unknown as CustomerEntity,
    } as VehicleEntity;
  }
}
