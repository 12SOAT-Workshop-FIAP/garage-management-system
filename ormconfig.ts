// ormconfig.ts
import { DataSourceOptions } from 'typeorm';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { Customer } from '@modules/customers/domain/customer.entity';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: +process.env.POSTGRES_PORT! || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Vehicle, Customer],
  synchronize: true,      // <— agora TRUE
  logging: true,
};

export default ormconfig;
