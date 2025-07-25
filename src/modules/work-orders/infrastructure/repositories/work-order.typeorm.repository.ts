import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkOrder } from '../../domain/work-order.entity';
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
    @InjectRepository(WorkOrder)
    private readonly repository: Repository<WorkOrder>,
  ) {}

  async findById(id: string): Promise<WorkOrder | null> {
    return this.repository.findOne({ where: { id } });
  }

  async save(workOrder: WorkOrder): Promise<WorkOrder> {
    return this.repository.save(workOrder);
  }
}
