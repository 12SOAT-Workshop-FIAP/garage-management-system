import { WorkOrder } from './work-order.entity';
import { WorkOrderStatus } from './work-order-status.enum';

/**
 * WorkOrderRepository (Repositório de Ordem de Serviço)
 * Contract for work order persistence operations.
 */
export abstract class WorkOrderRepository {
  abstract findById(id: string): Promise<WorkOrder | null>;
  abstract findAll(): Promise<WorkOrder[]>;
  abstract findByCustomerId(customerId: string): Promise<WorkOrder[]>;
  abstract findByVehicleId(vehicleId: string): Promise<WorkOrder[]>;
  abstract findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<WorkOrder[]>;
  abstract save(workOrder: WorkOrder): Promise<WorkOrder>;
  abstract delete(id: string): Promise<void>;
  abstract findCustomerByVehicleId(vehicleId: string): Promise<string | null>;
  abstract findCustomerByLicensePlate(licensePlate: string): Promise<string | null>;
}
