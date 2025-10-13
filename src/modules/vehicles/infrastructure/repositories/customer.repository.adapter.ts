import { Pool } from 'pg';
import { CustomerRepositoryPort } from '../../../vehicles/domain/ports/customer-repository.port';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_TEST_DB || 'garage',
});

export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  async existsById(customerId: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM customers WHERE id = $1 LIMIT 1', [customerId]);
    return (res.rowCount ?? 0) > 0;
  }
}
