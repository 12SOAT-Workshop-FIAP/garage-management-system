import { WorkOrder } from '../../../domain/entities/work-order.entity';
import { WorkOrderORM } from '../../entities/work-order.entity';
import { WorkOrderServiceORM } from '../../entities/work-order-service.entity';
import { WorkOrderPartORM } from '../../entities/work-order-part.entity';
import { WorkOrderService } from '../../../domain/work-order-service.value-object';
import { WorkOrderPart } from '../../../domain/work-order-part.value-object';

/**
 * WorkOrderMapper (Mapeador de Ordem de Serviço)
 * Maps between domain entities and ORM entities.
 * Follows hexagonal architecture adapter pattern.
 */
export class WorkOrderMapper {
  static toDomain(orm: WorkOrderORM): WorkOrder {
    const workOrder = WorkOrder.reconstitute({
      id: orm.id,
      customerId: orm.customerId,
      vehicleId: orm.vehicleId,
      description: orm.description,
      status: orm.status,
      estimatedCost: orm.estimatedCost,
      actualCost: orm.actualCost,
      laborCost: orm.laborCost,
      partsCost: orm.partsCost,
      diagnosis: orm.diagnosis,
      technicianNotes: orm.technicianNotes,
      customerApproval: orm.customerApproval,
      estimatedCompletionDate: orm.estimatedCompletionDate,
      completedAt: orm.completedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      services: orm.services ? orm.services.map(serviceORM => {
        const service = new WorkOrderService({
          serviceId: serviceORM.serviceId,
          serviceName: serviceORM.serviceName,
          serviceDescription: serviceORM.serviceDescription,
          quantity: serviceORM.quantity,
          unitPrice: serviceORM.unitPrice,
          estimatedDuration: serviceORM.estimatedDuration,
          technicianNotes: serviceORM.technicianNotes,
        });
        
        service.status = serviceORM.status as any;
        service.startedAt = serviceORM.startedAt;
        service.completedAt = serviceORM.completedAt;
        
        return service;
      }) : undefined,
      parts: orm.parts ? orm.parts.map(partORM => 
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
        )
      ) : undefined,
    });

    return workOrder;
  }

  static toORM(domain: WorkOrder): WorkOrderORM {
    const orm = new WorkOrderORM();
    
    orm.id = domain.id.value;
    orm.customerId = domain.customerId;
    orm.vehicleId = domain.vehicleId;
    orm.description = domain.description.value;
    orm.status = domain.status;
    orm.estimatedCost = domain.estimatedCost.value;
    orm.actualCost = domain.actualCost?.value;
    orm.laborCost = domain.laborCost?.value;
    orm.partsCost = domain.partsCost?.value;
    orm.diagnosis = domain.diagnosis?.value;
    orm.technicianNotes = domain.technicianNotes?.value;
    orm.customerApproval = domain.customerApproval;
    orm.estimatedCompletionDate = domain.estimatedCompletionDate;
    orm.completedAt = domain.completedAt;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    // Map services
    if (domain.services && domain.services.length > 0) {
      orm.services = domain.services.map(service => {
        const serviceORM = new WorkOrderServiceORM();
        serviceORM.workOrderId = domain.id.value;
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
      orm.parts = domain.parts.map(part => {
        const partORM = new WorkOrderPartORM();
        partORM.workOrderId = domain.id.value;
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
    return ormArray.map(orm => this.toDomain(orm));
  }
}
