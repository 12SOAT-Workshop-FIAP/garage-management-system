import { Pool } from 'pg';
import { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainError } from '../../domain/errors/domain-error';

// ⚙️ pool global ou injetado via DI
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || 'host.docker.internal',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_TEST_DB || 'garage',
});

type DBVehicleRow = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  customer_id: number;
  created_at?: Date;
  updated_at?: Date;
};

export class VehicleRepositoryAdapter implements VehicleRepositoryPort {
  update(vehicle: Vehicle): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<Vehicle | null> {
    const res = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    const row = res.rows[0];
    if (!row) return null;

    return Vehicle.restore(row.id, {
      plate: Plate.create(row.plate),
      brand: row.brand,
      model: row.model,
      year: row.year,
      customerId: row.customer_id,
    });
  }

  async findByPlate(plate: Plate): Promise<Vehicle | null> {
    const res = await pool.query('SELECT * FROM vehicles WHERE plate = $1', [plate.value]);
    const row = res.rows[0];
    if (!row) return null;

    return Vehicle.restore(row.id, {
      plate: Plate.create(row.plate),
      brand: row.brand,
      model: row.model,
      year: row.year,
      customerId: row.customer_id,
    });
  }

  async findAll(): Promise<Vehicle[]> {
    const res = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return res.rows.map(
      (row: {
        id: number;
        plate: string;
        brand: any;
        model: any;
        year: any;
        customer_id: any;
        color: any;
      }) =>
        Vehicle.restore(row.id, {
          plate: Plate.create(row.plate),
          brand: row.brand,
          model: row.model,
          year: row.year,
          customerId: row.customer_id,
        }),
    );
  }

  async existsByPlate(plate: Plate): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM vehicles WHERE plate = $1 LIMIT 1', [plate.value]);
    return (res.rowCount ?? 0) > 0; // trata undefined/null
  }

  async save(vehicle: Vehicle): Promise<number> {
    const v = vehicle.toPrimitives();
    const query = `
    INSERT INTO vehicles (plate, brand, model, year, customer_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
    const values = [v.plate, v.brand, v.model, v.year, v.customerId];
    const result = await pool.query(query, values);

    const id = result.rows?.[0]?.id;
    if (id == null) {
      throw new DomainError('DB_ERROR', 'Erro ao salvar veículo.');
    }
    return Number(id);
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
  }
}
