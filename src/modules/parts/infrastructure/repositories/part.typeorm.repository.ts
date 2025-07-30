import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';

@Injectable()
export class PartTypeormRepository implements PartRepository {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {}

  async findById(id: string): Promise<Part | null> {
    const part = await this.repository.findOne({ where: { id } });
    return part || null;
  }

  async findAll(filters?: {
    category?: string;
    active?: boolean;
    lowStock?: boolean;
    name?: string;
  }): Promise<Part[]> {
    const queryBuilder = this.repository.createQueryBuilder('part');

    if (filters?.category) {
      queryBuilder.andWhere('part.category = :category', { category: filters.category });
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere('part.active = :active', { active: filters.active });
    }

    if (filters?.name) {
      queryBuilder.andWhere('part.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters?.lowStock) {
      queryBuilder.andWhere('part.stockQuantity <= part.minStockLevel');
    }

    return await queryBuilder.orderBy('part.name', 'ASC').getMany();
  }

  async findByPartNumber(partNumber: string): Promise<Part | null> {
    const part = await this.repository.findOne({ where: { partNumber } });
    return part || null;
  }

  async findByCategory(category: string): Promise<Part[]> {
    return await this.repository.find({
      where: { category, active: true },
      order: { name: 'ASC' },
    });
  }

  async findLowStockParts(): Promise<Part[]> {
    return await this.repository
      .createQueryBuilder('part')
      .where('part.stockQuantity <= part.minStockLevel')
      .andWhere('part.active = :active', { active: true })
      .orderBy('part.name', 'ASC')
      .getMany();
  }

  async save(part: Part): Promise<Part> {
    return await this.repository.save(part);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(filters?: {
    category?: string;
    active?: boolean;
    lowStock?: boolean;
  }): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('part');

    if (filters?.category) {
      queryBuilder.andWhere('part.category = :category', { category: filters.category });
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere('part.active = :active', { active: filters.active });
    }

    if (filters?.lowStock) {
      queryBuilder.andWhere('part.stockQuantity <= part.minStockLevel');
    }

    return await queryBuilder.getCount();
  }
}
