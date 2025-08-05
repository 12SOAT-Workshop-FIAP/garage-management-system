import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkOrder as WorkOrderDomain } from '../../domain/work-order.entity';
import { WorkOrder as WorkOrderEntity } from '../entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { InjectRepository } from '@nestjs/typeorm';

export const WORK_ORDER_REPOSITORY = Symbol('WorkOrderRepository');

/**
 * WorkOrderTypeOrmRepository (Repositório TypeORM de Ordem de Serviço)
 * TypeORM implementation for WorkOrderRepository (Ordem de Serviço).
 */
@Injectable()
export class WorkOrderTypeOrmRepository implements WorkOrderRepository {
  constructor(
    @InjectRepository(WorkOrderEntity)
    private readonly repository: Repository<WorkOrderEntity>,
  ) {}

  async findById(id: string): Promise<WorkOrderDomain | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    
    // Convert TypeORM entity to Domain entity
    return new WorkOrderDomain({
      description: entity.description
    }, entity.id);
  }

  async save(workOrder: WorkOrderDomain): Promise<WorkOrderDomain> {
    // Convert Domain entity to TypeORM entity
    const entity = this.repository.create({
      id: workOrder.id,
      description: workOrder.description,
      created_at: workOrder.created_at
    });
    
    const saved = await this.repository.save(entity);
    
    // Convert back to Domain entity
    return new WorkOrderDomain({
      description: saved.description
    }, saved.id);
  }
}
