import { Injectable } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { GetAllWorkOrdersQuery } from '../queries/get-all-work-orders.query';

@Injectable()
export class GetAllWorkOrdersUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(query: GetAllWorkOrdersQuery): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findAll();
  }
}
