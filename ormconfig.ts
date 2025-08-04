import { DataSourceOptions } from 'typeorm';
import { Service as ServiceEntity } from '@modules/services/infrastructure/entities/service.entity';
import { User as UserEntity } from '@modules/users/infrastructure/entities/user.entity';

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',
  entities: [ServiceEntity, UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
};

export default ormconfig;
