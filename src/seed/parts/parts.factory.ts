import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';

import { PartOrmEntity } from '@modules/parts/infrastructure/entities/part-orm.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { Part as PartDomain } from '@modules/parts/domain/entities/part.entity';
import { PartMapper } from '@modules/parts/infrastructure/mappers/part.mapper';

export class PartsFactory extends Factory<PartOrmEntity> {
  protected entity = PartOrmEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<PartOrmEntity> {
    const name = faker.helpers.arrayElement([
      'Engine Oil Filter',
      'Front Brake Pad',
      'DOT 4 Brake Fluid',
      'Timing Belt',
      'Spark Plug',
      'Front Shock Absorber',
      'Fuel Pump',
      'Radiator',
      'Engine Air Filter',
      'Cabin Filter',
    ]);

    const description = faker.lorem.sentence();

    const partNumber = `${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;

    const category = faker.helpers.arrayElement([
      'filters',
      'brakes',
      'lubricants',
      'suspension',
      'engine',
      'cooling',
      'ignition',
    ]);

    const price = faker.number.int({ min: 1500, max: 200000 }) / 100; // $15.00 to $2,000.00
    const margin = faker.number.float({ min: 0.5, max: 0.9, fractionDigits: 2 });
    const costPrice = Math.max(1, Number((price * margin).toFixed(2)));

    const stockQuantity = faker.number.int({ min: 0, max: 100 });
    const minStockLevel = faker.number.int({ min: 1, max: 10 });

    const unit = faker.helpers.arrayElement(['PC', 'KG', 'L', 'BOX', 'M']);
    const supplier = faker.company.name();
    const active = faker.number.int({ min: 1, max: 100 }) <= 95;

    const newPart = new PartDomain({
      name,
      description,
      partNumber,
      category,
      price,
      costPrice,
      stockQuantity,
      minStockLevel,
      unit,
      supplier,
      active,
    });

    const OrmNewPart = PartMapper.toOrm(newPart);

    return OrmNewPart as unknown as PartOrmEntity;
  }
}
