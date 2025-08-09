import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { UpdateWorkOrderServiceDto, CompleteServiceDto } from '../dtos/work-order-services.dto';
import { WorkOrder } from '../../domain/work-order.entity';

/**
 * ManageWorkOrderServicesService
 * Application service for managing services within work orders
 */
@Injectable()
export class ManageWorkOrderServicesService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  /**
   * Remove service from work order
   */
  async removeService(workOrderId: string, serviceId: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      workOrder.removeService(serviceId);
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to remove service from work order');
    }
  }

  /**
   * Update service in work order
   */
  async updateService(workOrderId: string, serviceId: string, dto: UpdateWorkOrderServiceDto): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      workOrder.updateService(serviceId, {
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        technicianNotes: dto.technicianNotes,
      });
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to update service in work order');
    }
  }

  /**
   * Start service execution
   */
  async startService(workOrderId: string, serviceId: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      workOrder.startService(serviceId);
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to start service');
    }
  }

  /**
   * Complete service execution
   */
  async completeService(workOrderId: string, serviceId: string, dto: CompleteServiceDto): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      workOrder.completeService(serviceId, dto.technicianNotes);
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to complete service');
    }
  }

  /**
   * Cancel service
   */
  async cancelService(workOrderId: string, serviceId: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      workOrder.cancelService(serviceId);
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to cancel service');
    }
  }

  /**
   * Get work order services summary
   */
  async getServicesSummary(workOrderId: string): Promise<{
    workOrder: WorkOrder;
    summary: {
      totalServices: number;
      pendingServices: number;
      inProgressServices: number;
      completedServices: number;
      cancelledServices: number;
      totalCost: number;
      completionPercentage: number;
      estimatedTotalDuration: number;
    }
  }> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    const pendingServices = workOrder.getServicesByStatus('PENDING');
    const inProgressServices = workOrder.getServicesByStatus('IN_PROGRESS');
    const completedServices = workOrder.getServicesByStatus('COMPLETED');
    const cancelledServices = workOrder.getServicesByStatus('CANCELLED');

    const estimatedTotalDuration = workOrder.services.reduce(
      (total, service) => total + (service.estimatedDuration * service.quantity),
      0
    );

    return {
      workOrder,
      summary: {
        totalServices: workOrder.services.length,
        pendingServices: pendingServices.length,
        inProgressServices: inProgressServices.length,
        completedServices: completedServices.length,
        cancelledServices: cancelledServices.length,
        totalCost: workOrder.getTotalServicesCost(),
        completionPercentage: workOrder.getCompletionPercentage(),
        estimatedTotalDuration,
      },
    };
  }
}
