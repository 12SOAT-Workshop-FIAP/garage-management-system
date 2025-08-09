import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { WorkOrder } from '../../domain/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { WORK_ORDER_REPOSITORY } from '../../infrastructure/repositories/work-order.typeorm.repository';

/**
 * FindWorkOrderService (Serviço de busca de Ordem de Serviço)
 * Application service for finding work orders.
 */
@Injectable()
export class FindWorkOrderService {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  async findById(id: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }
    return workOrder;
  }

  async findAll(): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findAll();
  }

  async findByCustomerId(customerId: string): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByCustomerId(customerId);
  }

  async findByVehicleId(vehicleId: string): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByVehicleId(vehicleId);
  }

  async findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByStatus(status);
  }

  async findPendingApproval(): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByStatus(WorkOrderStatus.PENDING);
  }

  async findInProgress(): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByStatus(WorkOrderStatus.IN_PROGRESS);
  }

  async findCompleted(): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByStatus(WorkOrderStatus.COMPLETED);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByDateRange(startDate, endDate);
  }
}
