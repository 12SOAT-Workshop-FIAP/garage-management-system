// ormconfig.ts
import { Customer } from 'src/modules/customers/domain/customer.entity';
import { Vehicle } from 'src/modules/vehicles/domain/vehicle.entity';
import { DataSourceOptions } from 'typeorm';


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
