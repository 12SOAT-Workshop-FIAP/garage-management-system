import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';

import { Vehicle as VehicleEntity } from '@modules/vehicles/domain/vehicle.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CryptographyRepository } from '@modules/cryptography/infrastructure/repositories/cryptography.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

export class VehiclesFactory extends Factory<VehicleEntity> {
  protected entity = VehicleEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<VehicleEntity> {
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
      customer: undefined as unknown as CustomerEntity,
    } as VehicleEntity;
  }

  async create({ customer }: { customer: CustomerEntity }): Promise<VehicleEntity> {
    const cryptoRepository = new CryptographyRepository();
    const cryptographyService = new CryptographyService(cryptoRepository);
    const vehicle = await super.make();
    vehicle.customer = customer;

    const documentVo = await cryptographyService.encryptSensitiveData(
      vehicle.plate,
      'license-plate',
    );

    vehicle.plate = documentVo.encryptedValue;

    await this.dataSource.getRepository(VehicleEntity).save(vehicle);

    return vehicle;
  }
}
