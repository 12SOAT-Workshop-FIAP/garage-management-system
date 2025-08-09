import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { ServiceRepository } from '../../../services/domain/service.repository';
import { AddServiceToWorkOrderDto } from '../dtos/work-order-services.dto';
import { WorkOrderService } from '../../domain/work-order-service.value-object';
import { WorkOrder } from '../../domain/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';

/**
 * AddServiceToWorkOrderService
 * Application service for adding services to existing work orders
 */
@Injectable()
export class AddServiceToWorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(workOrderId: string, dto: AddServiceToWorkOrderDto): Promise<WorkOrder> {
    // Find the work order
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    // Check if work order is in a state that allows adding services
    if (workOrder.status === WorkOrderStatus.COMPLETED || 
        workOrder.status === WorkOrderStatus.DELIVERED || 
        workOrder.status === WorkOrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot add services to a completed, delivered, or cancelled work order');
    }

    // Find the service in the catalog
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundException('Service not found in catalog');
    }

    if (!service.active) {
      throw new BadRequestException('Service is not active');
    }

    // Use provided unit price or default to catalog price
    const unitPrice = dto.unitPrice ?? service.price;

    // Create WorkOrderService value object
    const workOrderService = new WorkOrderService({
      serviceId: service.id,
      serviceName: service.name,
      serviceDescription: service.description,
      quantity: dto.quantity,
      unitPrice: unitPrice,
      estimatedDuration: service.duration,
      technicianNotes: dto.technicianNotes,
    });

    try {
      // Add service to work order
      workOrder.addService(workOrderService);

      // Save updated work order
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to add service to work order');
    }
  }
}
