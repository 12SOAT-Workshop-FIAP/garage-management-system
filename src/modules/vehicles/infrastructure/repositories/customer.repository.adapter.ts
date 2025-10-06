import { Pool } from 'pg';
import { CustomerRepositoryPort } from '../../../vehicles/domain/ports/customer-repository.port';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  async existsById(customerId: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM customers WHERE id = $1 LIMIT 1', [customerId]);
    return (res.rowCount ?? 0) > 0;
  }
}
