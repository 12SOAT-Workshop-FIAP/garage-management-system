import { WorkOrder } from '../entities/work-order.entity';
import { WorkOrderStatus } from '../work-order-status.enum';
import { WorkOrderId } from '../value-objects';

/**
 * WorkOrderRepository (Repositório de Ordem de Serviço)
 * Contract for work order persistence operations.
 * Follows hexagonal architecture port pattern.
 */
export abstract class WorkOrderRepository {
  abstract findById(id: WorkOrderId): Promise<WorkOrder | null>;
  abstract findAll(): Promise<WorkOrder[]>;
  abstract findByCustomerId(customerId: number): Promise<WorkOrder[]>;
  abstract findByVehicleId(vehicleId: number): Promise<WorkOrder[]>;
  abstract findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<WorkOrder[]>;
  abstract save(workOrder: WorkOrder): Promise<WorkOrder>;
  abstract delete(id: WorkOrderId): Promise<void>;
  abstract findCustomerByVehicleId(vehicleId: number): Promise<number | null>;
  abstract findCustomerByLicensePlate(licensePlate: string): Promise<string | null>;
}
