import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { ServiceRepository } from '../../../services/domain/service.repository';
import { CreateWorkOrderWithServicesDto } from '../dtos/work-order-services.dto';
import { WorkOrderService } from '../../domain/work-order-service.value-object';
import { WorkOrder } from '../../domain/work-order.entity';
import { MessagingService } from '@shared/messaging/messaging.service';

/**
 * CreateWorkOrderWithServicesService
 * Application service for creating work orders with services included from the start
 */
@Injectable()
export class CreateWorkOrderWithServicesService {
  private readonly logger = new Logger(CreateWorkOrderWithServicesService.name);

  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly messagingService: MessagingService,
  ) {}

  async execute(dto: CreateWorkOrderWithServicesDto): Promise<WorkOrder> {
    // Validate all services exist and are active
    const serviceValidations = await Promise.all(
      dto.services.map(async (serviceItem) => {
        const service = await this.serviceRepository.findById(serviceItem.serviceId);
        if (!service) {
          throw new NotFoundException(`Service with ID ${serviceItem.serviceId} not found`);
        }
        if (!service.active) {
          throw new BadRequestException(`Service ${service.name} is not active`);
        }
        return { service, item: serviceItem };
      })
    );

    // Create WorkOrderService value objects
    const workOrderServices = serviceValidations.map(({ service, item }) => {
      const unitPrice = item.unitPrice ?? service.price;
      
      return new WorkOrderService({
        serviceId: service.id,
        serviceName: service.name,
        serviceDescription: service.description,
        quantity: item.quantity,
        unitPrice: unitPrice,
        estimatedDuration: service.duration,
        technicianNotes: item.technicianNotes,
      });
    });

    // Calculate total estimated cost
    const totalEstimatedCost = workOrderServices.reduce(
      (total, service) => total + service.totalPrice, 
      0
    );

    try {
      // Create work order with services
      const workOrder = new WorkOrder({
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        description: dto.description,
        diagnosis: dto.diagnosis,
        estimatedCost: totalEstimatedCost,
        services: workOrderServices,
      });

      // Save work order
      const savedWorkOrder = await this.workOrderRepository.save(workOrder);

      // Publicar evento para iniciar saga
      await this.messagingService.publish('work-order.created', {
        workOrderId: savedWorkOrder.id,
        customerId: savedWorkOrder.customerId,
        vehicleId: savedWorkOrder.vehicleId,
      });
      this.logger.log(`Published work-order.created for WO ${savedWorkOrder.id}`);

      return savedWorkOrder;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to create work order: ${error.message}`);
      }
      throw new BadRequestException('Failed to create work order with services');
    }
  }
}
