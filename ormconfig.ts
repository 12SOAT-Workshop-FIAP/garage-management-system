import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',
  
  entities: [join(__dirname, 'src', '**', '*.entity.ts')],
  migrations: [join(__dirname, 'src', 'migrations', '*.ts')],

  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(ormconfig);
export default dataSource;