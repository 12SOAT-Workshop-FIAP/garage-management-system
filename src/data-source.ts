import { DataSource } from 'typeorm';
const path = require('path');

// Para migrations, usamos variáveis de ambiente diretamente
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'garage',

  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],

  synchronize: false,
  logging: true,
});

export const AppDataSource = dataSource;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source foi inicializado com sucesso!!!');
  })
  .catch((err) => {
    console.error('Erro durante a inicializacao do Data Source', err);
  });
