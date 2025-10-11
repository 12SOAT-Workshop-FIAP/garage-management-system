import { WorkOrderStatus } from '../../domain/work-order-status.enum';

export class GetWorkOrdersByStatusQuery {
  constructor(public readonly status: WorkOrderStatus) {}
}
