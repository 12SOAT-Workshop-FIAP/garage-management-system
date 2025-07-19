import { WorkOrder } from './work-order.entity';

/**
 * WorkOrderRepository (Repositório de Ordem de Serviço)
 * Contract for work order persistence operations.
 */
export interface WorkOrderRepository {
  findById(id: string): Promise<WorkOrder | null>;
  save(workOrder: WorkOrder): Promise<WorkOrder>;
}
