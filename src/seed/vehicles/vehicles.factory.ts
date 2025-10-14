import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';

import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CryptographyRepository } from '@modules/cryptography/infrastructure/repositories/cryptography.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';
import { VehicleOrmEntity } from '@modules/vehicles/infrastructure/entities/vehicle-orm.entity';

export class VehiclesFactory extends Factory<VehicleOrmEntity> {
  protected entity = VehicleOrmEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<VehicleOrmEntity> {
    const brand = faker.vehicle.manufacturer();
    const model = faker.vehicle.model();

    const plateType = faker.helpers.arrayElement(['old', 'mercosul']);

    let plate: string;
    if (plateType === 'old') {
      plate = faker.helpers.replaceSymbols('???####');
    } else {
      plate = faker.helpers.replaceSymbols('???#?##');
    }

    const currentYear = new Date().getFullYear();
    const year = faker.number.int({ min: 1995, max: currentYear });

    return {
      brand,
      model,
      plate,
      year,
      // Allow seeder to override; default to null-ish to enforce seeder responsibility
    } as VehicleOrmEntity;
  }

  async createForCustomer({ customer }: { customer: CustomerEntity }): Promise<VehicleOrmEntity> {
    const cryptoRepository = new CryptographyRepository();
    const cryptographyService = new CryptographyService(cryptoRepository);
    const vehicle = await super.make();
    vehicle.customerId = customer.id;

    const documentVo = await cryptographyService.encryptSensitiveData(
      vehicle.plate,
      'license-plate',
    );

    vehicle.plate = documentVo.encryptedValue;

    await this.dataSource.getRepository(VehicleOrmEntity).save(vehicle);

    return vehicle;
  }
}
