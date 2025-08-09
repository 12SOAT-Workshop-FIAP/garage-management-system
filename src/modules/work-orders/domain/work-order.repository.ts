import { WorkOrder } from './work-order.entity';
import { WorkOrderStatus } from './work-order-status.enum';

/**
 * WorkOrderRepository (Repositório de Ordem de Serviço)
 * Contract for work order persistence operations.
 */
export interface WorkOrderRepository {
  findById(id: string): Promise<WorkOrder | null>;
  findAll(): Promise<WorkOrder[]>;
  findByCustomerId(customerId: string): Promise<WorkOrder[]>;
  findByVehicleId(vehicleId: string): Promise<WorkOrder[]>;
  findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<WorkOrder[]>;
  save(workOrder: WorkOrder): Promise<WorkOrder>;
  delete(id: string): Promise<void>;
}
