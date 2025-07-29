import { CustomerEntity } from '@modules/customers/infrastructure/repositories/customer.entity';
import { VehicleEntity } from '@modules/vehicles/infrastructure/vehicle.entity';
import { DataSourceOptions } from 'typeorm';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',
  entities: [VehicleEntity, CustomerEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
};

export default ormconfig;
