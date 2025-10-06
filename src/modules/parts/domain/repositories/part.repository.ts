import { Part } from '../entities/part.entity';

export abstract class PartRepository {
  abstract findAll(): Promise<Part[] | null>;
  abstract findById(id: number): Promise<Part | null>;
  abstract findByPartNumber(partNumber: string): Promise<Part | null>;
  abstract findLowStockParts(): Promise<Part[]>;
  abstract findByCategory(category: string): Promise<Part[]>;
  abstract create(part: Part): Promise<Part>;
  abstract update(oldPart: Part, newPart: Part): Promise<Part | null>;
  abstract delete(part: Part): Promise<void>;
  abstract updateStock(id: number, quantity: number): Promise<Part | null>;
}
