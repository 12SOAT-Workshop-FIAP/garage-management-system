import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartRepository } from '../../../domain/repositories/part.repository';
import { Part } from '../../../domain/entities/part.entity';
import { PartEntity } from '../../entities/part.entity';
import { PartMapper } from '../../mappers/part.mapper';
import { PartOrmEntity } from '../../entities/part-orm.entity';

@Injectable()
export class PartTypeOrmRepository extends PartRepository {
  constructor(
    @InjectRepository(PartOrmEntity)
    private readonly ormRepository: Repository<PartEntity>,
  ) {
    super();
  }

  async findAll(): Promise<Part[] | null> {
    const parts = await this.ormRepository.find();
    return parts.length > 0 ? PartMapper.toDomainList(parts) : null;
  }

  async findById(id: number): Promise<Part | null> {
    const part = await this.ormRepository.findOne({ where: { id } });
    return part ? PartMapper.toDomain(part) : null;
  }

  async findByPartNumber(partNumber: string): Promise<Part | null> {
    const part = await this.ormRepository.findOne({ where: { partNumber } });
    return part ? PartMapper.toDomain(part) : null;
  }

  async findLowStockParts(): Promise<Part[]> {
    const parts = await this.ormRepository
      .createQueryBuilder('part')
      .where('part.stockQuantity <= part.minStockLevel')
      .getMany();

    return PartMapper.toDomainList(parts);
  }

  async findByCategory(category: string): Promise<Part[]> {
    const parts = await this.ormRepository.find({ where: { category } });
    return PartMapper.toDomainList(parts);
  }

  async create(part: Part): Promise<Part> {
    const ormEntity = PartMapper.toOrm(part);
    const savedEntity = await this.ormRepository.save(ormEntity);
    return PartMapper.toDomain(savedEntity);
  }

  async update(oldPart: Part, newPart: Part): Promise<Part | null> {
    if (!oldPart.id) {
      throw new Error('Cannot update part without ID');
    }

    const ormEntity = PartMapper.toOrm(newPart);
    ormEntity.id = oldPart.id.value;

    const updatedEntity = await this.ormRepository.save(ormEntity);
    return PartMapper.toDomain(updatedEntity);
  }

  async delete(part: Part): Promise<void> {
    if (!part.id) {
      throw new Error('Cannot delete part without ID');
    }

    await this.ormRepository.delete(part.id.value);
  }

  async updateStock(id: number, quantity: number): Promise<Part | null> {
    const part = await this.findById(id);
    if (!part) {
      return null;
    }

    if (quantity >= 0) {
      part.updateStock(quantity);
    } else {
      part.removeStock(Math.abs(quantity));
    }

    return await this.update(part, part);
  }
}
