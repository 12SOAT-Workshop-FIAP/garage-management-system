import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',
  entities: [
    'src/modules/**/domain/*.entity.ts',
    'src/modules/**/infrastructure/entities/*.entity.ts',
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
