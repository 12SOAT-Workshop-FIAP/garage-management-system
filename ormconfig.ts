import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { Service } from '@modules/services/infrastructure/entities/service.entity';
import { User } from '@modules/users/infrastructure/entities/user.entity';
import { WorkOrderORM } from '@modules/work-orders/infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '@modules/work-orders/infrastructure/entities/work-order-service.entity';
import { WorkOrderPartORM } from '@modules/work-orders/infrastructure/entities/work-order-part.entity';
import { PartOrmEntity } from '@modules/parts/infrastructure/entities/part-orm.entity';
import { VehicleOrmEntity } from '@modules/vehicles/infrastructure/entities/vehicle-orm.entity';

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',

  entities: [
    VehicleOrmEntity,
    CustomerEntity,
    Service,
    User,
    WorkOrderORM,
    WorkOrderServiceORM,
    WorkOrderPartORM,
    PartOrmEntity,
  ],
  // validar melhor forma de utilizar entities: [join(__dirname, 'src', '**', '*.entity.ts')],
  migrations: [join(__dirname, 'src', 'migrations', '*.ts')],

  synchronize: false,
  logging: true,
  ...(process.env.NODE_ENV !== 'development'
    ? {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {}),
};

export const dataSource = new DataSource(ormconfig);
