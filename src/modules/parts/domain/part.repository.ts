import { Part } from './part.entity';

export interface PartRepository {
  create(part: Part): Promise<void>;
  update(part: Part): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Part[]>;
  findById(id: string): Promise<Part | null>;
  save(part: Part): Promise<Part>;
  findByPartNumber(partNumber: string): Promise<Part | null>;
  findLowStockParts(): Promise<Part[]>;
  findByCategory(category: string): Promise<Part[]>;
}
