import { WorkOrder } from '../domain/work-order.entity';
import { WorkOrderORM } from './entities/work-order.entity';
import { WorkOrderServiceORM } from './entities/work-order-service.entity';
import { WorkOrderPartORM } from './entities/work-order-part.entity';
import { WorkOrderService } from '../domain/work-order-service.value-object';
import { WorkOrderPart } from '../domain/work-order-part.value-object';

/**
 * WorkOrderMapper (Mapeador de Ordem de Serviço)
 * Maps between domain entities and ORM entities.
 */
export class WorkOrderMapper {
  static toDomain(orm: WorkOrderORM): WorkOrder {
    const workOrder = new WorkOrder(
      {
        customerId: orm.customerId.toString(),
        vehicleId: orm.vehicleId.toString(),
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

    // Map services if loaded
    if (orm.services) {
      workOrder.services = orm.services.map((serviceORM) => {
        const service = new WorkOrderService({
          serviceId: serviceORM.serviceId,
          serviceName: serviceORM.serviceName,
          serviceDescription: serviceORM.serviceDescription,
          quantity: serviceORM.quantity,
          unitPrice: serviceORM.unitPrice,
          estimatedDuration: serviceORM.estimatedDuration,
          technicianNotes: serviceORM.technicianNotes,
        });

        // Set additional properties
        service.status = serviceORM.status as any;
        service.startedAt = serviceORM.startedAt;
        service.completedAt = serviceORM.completedAt;

        return service;
      });
    }

    // Map parts if loaded
    if (orm.parts) {
      workOrder.parts = orm.parts.map(
        (partORM) =>
          new WorkOrderPart(
            partORM.partId,
            partORM.partName,
            partORM.partDescription,
            partORM.partNumber,
            partORM.quantity,
            partORM.unitPrice,
            partORM.notes,
            partORM.isApproved,
            partORM.appliedAt,
          ),
      );
    }

    return workOrder;
  }

  static toORM(domain: WorkOrder): WorkOrderORM {
    const orm = new WorkOrderORM();

    orm.id = domain.id;
    orm.customerId = parseInt(domain.customerId);
    orm.vehicleId = parseInt(domain.vehicleId);
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

    // Map services
    if (domain.services && domain.services.length > 0) {
      orm.services = domain.services.map((service) => {
        const serviceORM = new WorkOrderServiceORM();
        serviceORM.workOrderId = domain.id;
        serviceORM.serviceId = service.serviceId;
        serviceORM.serviceName = service.serviceName;
        serviceORM.serviceDescription = service.serviceDescription;
        serviceORM.quantity = service.quantity;
        serviceORM.unitPrice = service.unitPrice;
        serviceORM.totalPrice = service.totalPrice;
        serviceORM.estimatedDuration = service.estimatedDuration;
        serviceORM.status = service.status;
        serviceORM.startedAt = service.startedAt;
        serviceORM.completedAt = service.completedAt;
        serviceORM.technicianNotes = service.technicianNotes;
        return serviceORM;
      });
    }

    // Map parts
    if (domain.parts && domain.parts.length > 0) {
      orm.parts = domain.parts.map((part) => {
        const partORM = new WorkOrderPartORM();
        partORM.workOrderId = domain.id;
        partORM.partId = part.partId;
        partORM.partName = part.partName;
        partORM.partDescription = part.partDescription;
        partORM.partNumber = part.partNumber;
        partORM.quantity = part.quantity;
        partORM.unitPrice = part.unitPrice;
        partORM.totalPrice = part.totalPrice;
        partORM.notes = part.notes;
        partORM.isApproved = part.isApproved;
        partORM.appliedAt = part.appliedAt;
        return partORM;
      });
    }

    return orm;
  }

  static toDomainArray(ormArray: WorkOrderORM[]): WorkOrder[] {
    return ormArray.map((orm) => this.toDomain(orm));
  }
}
