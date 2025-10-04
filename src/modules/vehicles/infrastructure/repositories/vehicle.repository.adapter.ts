import { Pool } from 'pg';
import { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainError } from '../../domain/errors/domain-error';

// ⚙️ pool global ou injetado via DI
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type DBVehicleRow = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  customer_id: number;
  color: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export class VehicleRepositoryAdapter implements VehicleRepositoryPort {
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
      color: row.color ?? null,
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
      color: row.color ?? null,
    });
  }

  async findAll(): Promise<Vehicle[]> {
    const res = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return res.rows.map((row: { id: number; plate: string; brand: any; model: any; year: any; customer_id: any; color: any; }) =>
      Vehicle.restore(row.id, {
        plate: Plate.create(row.plate),
        brand: row.brand,
        model: row.model,
        year: row.year,
        customerId: row.customer_id,
        color: row.color ?? null,
      }),
    );
  }

async existsByPlate(plate: Plate): Promise<boolean> {
  const res = await pool.query('SELECT 1 FROM vehicles WHERE plate = $1 LIMIT 1', [plate.value]);
  return (res.rowCount ?? 0) > 0; // trata undefined/null
}

  async save(vehicle: Vehicle): Promise<void> {
    const v = vehicle.toPrimitives();
    const query = `
      INSERT INTO vehicles (plate, brand, model, year, customer_id, color)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [v.plate, v.brand, v.model, v.year, v.customerId, v.color];
    const result = await pool.query(query, values);

    if (!result.rows[0]) {
      throw new DomainError('DB_ERROR', 'Erro ao salvar veículo.');
    }
  }

  async update(vehicle: Vehicle): Promise<void> {
    const v = vehicle.toPrimitives();
    const query = `
      UPDATE vehicles
      SET plate = $1, brand = $2, model = $3, year = $4, customer_id = $5, color = $6, updated_at = NOW()
      WHERE id = $7;
    `;
    const values = [v.plate, v.brand, v.model, v.year, v.customerId, v.color, v.id];
    await pool.query(query, values);
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
  }
}
