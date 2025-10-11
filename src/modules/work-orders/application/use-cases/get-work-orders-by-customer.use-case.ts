import { Injectable } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { GetWorkOrdersByCustomerQuery } from '../queries/get-work-orders-by-customer.query';

@Injectable()
export class GetWorkOrdersByCustomerUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(query: GetWorkOrdersByCustomerQuery): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByCustomerId(query.customerId);
  }
}
