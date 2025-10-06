import { Part } from '../entities/part.entity';

export abstract class PartRepository {
  abstract create(part: Part): Promise<void>;
  abstract update(part: Part): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Part[]>;
  abstract findById(id: string): Promise<Part | null>;
  abstract save(part: Part): Promise<Part>;
  abstract findByPartNumber(partNumber: string): Promise<Part | null>;
  abstract findLowStockParts(): Promise<Part[]>;
  abstract findByCategory(category: string): Promise<Part[]>;
}
