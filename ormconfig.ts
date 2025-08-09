import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { Service } from '@modules/services/infrastructure/entities/service.entity';
import { User } from '@modules/users/infrastructure/entities/user.entity';
import { WorkOrderORM } from '@modules/work-orders/infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '@modules/work-orders/infrastructure/entities/work-order-service.entity';
import { Part } from '@modules/parts/infrastructure/entities/part.entity';

dotenv.config();

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',

  entities: [Vehicle, CustomerEntity, Service, User, WorkOrderORM, WorkOrderServiceORM, Part],
  // validar melhor forma de utilizar entities: [join(__dirname, 'src', '**', '*.entity.ts')],
  migrations: [join(__dirname, 'src', 'migrations', '*.ts')],

  synchronize: false,
  logging: true,
};

export const dataSource = new DataSource(ormconfig);
