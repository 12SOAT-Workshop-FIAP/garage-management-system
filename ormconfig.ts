import { CustomerEntity } from 'src/modules/customers/infrastructure/customer.entity';
import { Vehicle } from 'src/modules/vehicles/domain/vehicle.entity';
import { DataSourceOptions } from 'typeorm';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',
  entities: [Vehicle, CustomerEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
