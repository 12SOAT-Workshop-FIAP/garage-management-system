import { Part } from './part.entity';

/**
 * PartRepository
 * Contract for part persistence operations.
 * (Contrato para operações de persistência de peças)
 */
export interface PartRepository {
  /**
   * Find part by ID
   * (Buscar peça por ID)
   */
  findById(id: string): Promise<Part | null>;

  /**
   * Find all parts with optional filters
   * (Buscar todas as peças com filtros opcionais)
   */
  findAll(filters?: {
    category?: string;
    active?: boolean;
    lowStock?: boolean;
    name?: string;
  }): Promise<Part[]>;

  /**
   * Find part by part number
   * (Buscar peça por número da peça)
   */
  findByPartNumber(partNumber: string): Promise<Part | null>;

  /**
   * Find parts by category
   * (Buscar peças por categoria)
   */
  findByCategory(category: string): Promise<Part[]>;

  /**
   * Find parts with low stock
   * (Buscar peças com estoque baixo)
   */
  findLowStockParts(): Promise<Part[]>;

  /**
   * Save part
   * (Salvar peça)
   */
  save(part: Part): Promise<Part>;

  /**
   * Delete part
   * (Deletar peça)
   */
  delete(id: string): Promise<void>;

  /**
   * Count total parts
   * (Contar total de peças)
   */
  count(filters?: {
    category?: string;
    active?: boolean;
    lowStock?: boolean;
  }): Promise<number>;
}
