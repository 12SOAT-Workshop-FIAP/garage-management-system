import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';

import { Service as ServiceEntity } from '@modules/services/infrastructure/entities/service.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { Service } from '@modules/services/domain/service.entity';

export class ServiceFactory extends Factory<ServiceEntity> {
  protected entity = ServiceEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<ServiceEntity> {
    const serviceName = faker.helpers.arrayElement([
      'Oil Change',
      'Brake Inspection',
      'Tire Rotation',
      'Engine Diagnostics',
      'Battery Replacement',
      'Wheel Alignment',
      'Air Conditioning Service',
      'Transmission Flush',
      'Coolant System Service',
      'Spark Plug Replacement',
    ]);

    const serviceDescription = faker.lorem.sentence();

    // Price between 50.00 and 2000.00 with 2 decimals
    const servicePrice = faker.number.int({ min: 5000, max: 200000 }) / 100;

    // 90% chance of being active
    const serviceIsActive = faker.number.int({ min: 1, max: 100 }) <= 90;

    // Duration in minutes, multiples of 30, between 30 and 240
    const serviceDuration = faker.number.int({ min: 1, max: 8 }) * 30;

    const newService = new Service({
      name: serviceName,
      description: serviceDescription,
      price: servicePrice,
      active: serviceIsActive,
      duration: serviceDuration,
    });

    return newService;
  }
}
