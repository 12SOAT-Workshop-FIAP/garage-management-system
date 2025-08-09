import { WorkOrder } from '../domain/work-order.entity';
import { WorkOrderORM } from './entities/work-order.entity';

/**
 * WorkOrderMapper (Mapeador de Ordem de Serviço)
 * Maps between domain entities and ORM entities.
 */
export class WorkOrderMapper {
  static toDomain(orm: WorkOrderORM): WorkOrder {
    const workOrder = new WorkOrder(
      {
        customerId: orm.customerId,
        vehicleId: orm.vehicleId,
        description: orm.description,
        estimatedCost: orm.estimatedCost,
        diagnosis: orm.diagnosis,
      },
      orm.id,
    );

    // Set additional properties
    workOrder.status = orm.status;
    workOrder.actualCost = orm.actualCost;
    workOrder.laborCost = orm.laborCost;
    workOrder.partsCost = orm.partsCost;
    workOrder.technicianNotes = orm.technicianNotes;
    workOrder.customerApproval = orm.customerApproval;
    workOrder.createdAt = orm.createdAt;
    workOrder.updatedAt = orm.updatedAt;

    return workOrder;
  }

  static toORM(domain: WorkOrder): WorkOrderORM {
    const orm = new WorkOrderORM();
    
    orm.id = domain.id;
    orm.customerId = domain.customerId;
    orm.vehicleId = domain.vehicleId;
    orm.description = domain.description;
    orm.status = domain.status;
    orm.estimatedCost = domain.estimatedCost;
    orm.actualCost = domain.actualCost;
    orm.laborCost = domain.laborCost;
    orm.partsCost = domain.partsCost;
    orm.diagnosis = domain.diagnosis;
    orm.technicianNotes = domain.technicianNotes;
    orm.customerApproval = domain.customerApproval || false;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    return orm;
  }

  static toDomainArray(ormArray: WorkOrderORM[]): WorkOrder[] {
    return ormArray.map(orm => this.toDomain(orm));
  }
}
