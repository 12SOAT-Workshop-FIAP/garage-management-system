import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { WorkOrder as WorkOrderDomain } from '../../domain/work-order.entity';
import { WorkOrderORM } from '../entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { WorkOrderMapper } from '../work-order.mapper';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * WorkOrderTypeOrmRepository (Repositório TypeORM de Ordem de Serviço)
 * TypeORM implementation for WorkOrderRepository (Ordem de Serviço).
 */
@Injectable()
export class WorkOrderTypeOrmRepository implements WorkOrderRepository {
  constructor(
    @InjectRepository(WorkOrderORM)
    private readonly repository: Repository<WorkOrderORM>,
  ) {}

  async findById(id: string): Promise<WorkOrderDomain | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    
    return WorkOrderMapper.toDomain(entity);
  }

  async findAll(): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    
    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByCustomerId(customerId: string): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    
    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByVehicleId(vehicleId: string): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: { vehicleId },
      order: { createdAt: 'DESC' },
    });
    
    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByStatus(status: WorkOrderStatus): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
    
    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
    });
    
    return WorkOrderMapper.toDomainArray(entities);
  }

  async save(workOrder: WorkOrderDomain): Promise<WorkOrderDomain> {
    const entity = WorkOrderMapper.toORM(workOrder);
    const saved = await this.repository.save(entity);
    
    return WorkOrderMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
