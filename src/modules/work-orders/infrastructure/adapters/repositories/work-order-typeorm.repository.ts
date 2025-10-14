import { Injectable } from '@nestjs/common';
import { Repository, Between, In } from 'typeorm';
import { WorkOrder as WorkOrderDomain } from '../../../domain/entities/work-order.entity';
import { WorkOrderORM } from '../../entities/work-order.entity';
import { WorkOrderPartORM } from '../../entities/work-order-part.entity';
import { WorkOrderServiceORM } from '../../entities/work-order-service.entity';
import { WorkOrderRepository } from '../../../domain/repositories/work-order.repository';
import { WorkOrderStatus } from '../../../domain/work-order-status.enum';
import { WorkOrderMapper } from '../mappers/work-order.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleOrmEntity } from '@modules/vehicles/infrastructure/entities/vehicle-orm.entity';
import { WorkOrderId } from '../../../domain/value-objects';

/**
 * WorkOrderTypeOrmRepository (Repositório TypeORM de Ordem de Serviço)
 * TypeORM implementation for WorkOrderRepository (Ordem de Serviço).
 * Follows hexagonal architecture adapter pattern.
 */
@Injectable()
export class WorkOrderTypeOrmRepository implements WorkOrderRepository {
  constructor(
    @InjectRepository(WorkOrderORM)
    private readonly repository: Repository<WorkOrderORM>,
  ) {}

  async findById(id: WorkOrderId): Promise<WorkOrderDomain | null> {
    const entity = await this.repository.findOne({
      where: { id: id.value },
      relations: ['services', 'parts'],
    });
    if (!entity) return null;

    return WorkOrderMapper.toDomain(entity);
  }

  async findAll(): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: {
        status: In([
          WorkOrderStatus.APPROVED,
          WorkOrderStatus.CANCELLED,
          WorkOrderStatus.IN_PROGRESS,
          WorkOrderStatus.PENDING,
          WorkOrderStatus.DIAGNOSIS,
          WorkOrderStatus.RECEIVED,
          WorkOrderStatus.WAITING_PARTS,
        ]),
      },
      relations: ['services', 'parts'],
      order: { status: 'ASC', createdAt: 'ASC' },
    });

    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByCustomerId(customerId: string): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: { customerId },
      relations: ['services', 'parts'],
      order: { createdAt: 'DESC' },
    });

    return WorkOrderMapper.toDomainArray(entities);
  }

  async findByVehicleId(vehicleId: string): Promise<WorkOrderDomain[]> {
    const entities = await this.repository.find({
      where: { vehicleId },
      relations: ['services', 'parts'],
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
    return await this.repository.manager.transaction(async (manager) => {
      const entity = WorkOrderMapper.toORM(workOrder);

      // Save the main work order without relations first
      const mainEntityData = {
        id: entity.id,
        customerId: entity.customerId,
        vehicleId: entity.vehicleId,
        description: entity.description,
        status: entity.status,
        estimatedCost: entity.estimatedCost,
        actualCost: entity.actualCost,
        laborCost: entity.laborCost,
        partsCost: entity.partsCost,
        diagnosis: entity.diagnosis,
        technicianNotes: entity.technicianNotes,
        customerApproval: entity.customerApproval,
        estimatedCompletionDate: entity.estimatedCompletionDate,
        completedAt: entity.completedAt,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };

      const savedMain = await manager.save(WorkOrderORM, mainEntityData);

      // Handle parts
      if (entity.parts && entity.parts.length > 0) {
        await manager.delete(WorkOrderPartORM, { workOrderId: savedMain.id });

        for (const part of entity.parts) {
          await manager.save(WorkOrderPartORM, {
            workOrderId: savedMain.id,
            partId: part.partId,
            partName: part.partName,
            partDescription: part.partDescription,
            partNumber: part.partNumber,
            quantity: part.quantity,
            unitPrice: part.unitPrice,
            totalPrice: part.totalPrice,
            notes: part.notes,
            isApproved: part.isApproved,
            appliedAt: part.appliedAt,
          });
        }
      } else {
        await manager.delete(WorkOrderPartORM, { workOrderId: savedMain.id });
      }

      // Handle services
      if (entity.services && entity.services.length > 0) {
        await manager.delete(WorkOrderServiceORM, { workOrderId: savedMain.id });

        for (const service of entity.services) {
          await manager.save(WorkOrderServiceORM, {
            workOrderId: savedMain.id,
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            serviceDescription: service.serviceDescription,
            quantity: service.quantity,
            unitPrice: service.unitPrice,
            totalPrice: service.totalPrice,
            estimatedDuration: service.estimatedDuration,
            actualDuration: service.actualDuration,
            estimatedCost: service.estimatedCost,
            actualCost: service.actualCost,
            status: service.status,
            startedAt: service.startedAt,
            completedAt: service.completedAt,
            technicianNotes: service.technicianNotes,
            notes: service.notes,
          });
        }
      } else {
        await manager.delete(WorkOrderServiceORM, { workOrderId: savedMain.id });
      }

      // Reload with relations
      const reloaded = await manager.findOne(WorkOrderORM, {
        where: { id: savedMain.id },
        relations: ['services', 'parts'],
      });

      return WorkOrderMapper.toDomain(reloaded!);
    });
  }

  async delete(id: WorkOrderId): Promise<void> {
    await this.repository.delete(id.value);
  }

  async findCustomerByVehicleId(vehicleId: string): Promise<string | null> {
    const dataSource = this.repository.manager.connection;
    const vehicleRepository = dataSource.getRepository(VehicleOrmEntity);
    const vehicle = await vehicleRepository.findOne({
      where: { id: parseInt(vehicleId) },
      relations: ['customer'],
    });

    return vehicle?.customer?.id?.toString() || null;
  }

  async findCustomerByLicensePlate(licensePlate: string): Promise<string | null> {
    const dataSource = this.repository.manager.connection;
    const vehicleRepository = dataSource.getRepository(VehicleOrmEntity);
    const vehicle = await vehicleRepository.findOne({
      where: { plate: licensePlate },
      relations: ['customer'],
    });

    return vehicle?.customer?.id?.toString() || null;
  }
}
