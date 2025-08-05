import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part as PartEntity } from '../../domain/part.entity';
import { PartRepository } from '../../domain/part.repository';
import { Part as TypeOrmPart } from '../entities/part.entity';

export const PART_REPOSITORY = Symbol('PartRepository');

@Injectable()
export class PartTypeOrmRepository implements PartRepository {
  constructor(
    @InjectRepository(TypeOrmPart)
    private readonly repository: Repository<TypeOrmPart>,
  ) {}

  async create(part: PartEntity): Promise<void> {
    const newPart = this.repository.create(part);
    await this.repository.save(newPart);
  }

  async update(part: PartEntity): Promise<void> {
    await this.repository.save(part);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<PartEntity[]> {
    const parts = await this.repository.find();
    return parts.map((part) => this.toDomain(part));
  }

  async findById(id: string): Promise<PartEntity | null> {
    const part = await this.repository.findOne({ where: { id } });
    if (!part) {
      return null;
    }
    return this.toDomain(part);
  }

  async save(part: PartEntity): Promise<PartEntity> {
    const entity = this.repository.create({
      id: part.id,
      name: part.name,
      description: part.description,
      partNumber: part.partNumber,
      category: part.category,
      price: part.price,
      costPrice: part.costPrice,
      stockQuantity: part.stockQuantity,
      minStockLevel: part.minStockLevel,
      unit: part.unit,
      supplier: part.supplier,
      active: part.active,
      createdAt: part.createdAt,
      updatedAt: part.updatedAt,
    });
    
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByPartNumber(partNumber: string): Promise<PartEntity | null> {
    const part = await this.repository.findOne({ where: { partNumber } });
    if (!part) {
      return null;
    }
    return this.toDomain(part);
  }

  async findLowStockParts(): Promise<PartEntity[]> {
    const parts = await this.repository
      .createQueryBuilder('part')
      .where('part.stockQuantity <= part.minStockLevel')
      .getMany();
    
    return parts.map((part) => this.toDomain(part));
  }

  async findByCategory(category: string): Promise<PartEntity[]> {
    const parts = await this.repository.find({ where: { category } });
    return parts.map((part) => this.toDomain(part));
  }

  private toDomain(part: TypeOrmPart): PartEntity {
    const partEntity = new PartEntity(
      {
        name: part.name,
        description: part.description,
        partNumber: part.partNumber,
        category: part.category,
        price: part.price,
        costPrice: part.costPrice,
        stockQuantity: part.stockQuantity,
        minStockLevel: part.minStockLevel,
        unit: part.unit,
        supplier: part.supplier,
        active: part.active,
      },
      part.id,
    );

    // Re-assigning properties to ensure they are correctly set
    partEntity.createdAt = part.createdAt;
    partEntity.updatedAt = part.updatedAt;

    return partEntity;
  }
}
