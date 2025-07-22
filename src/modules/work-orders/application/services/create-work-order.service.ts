import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { CreateWorkOrderDto } from '../dtos/create-work-order.dto';
import { WORK_ORDER_REPOSITORY } from '@modules/work-orders/infrastructure/repositories/work-order.typeorm.repository';

/**
 * CreateWorkOrderService (Serviço de criação de Ordem de Serviço)
 * Application service for creating a work order (Ordem de Serviço).
 */
@Injectable()
export class CreateWorkOrderService {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  async execute(_dto: CreateWorkOrderDto) {
    // TODO: Implement work order creation logic
    return null;
  }
}
