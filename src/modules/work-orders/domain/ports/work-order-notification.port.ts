import { WorkOrderStatus } from '../work-order-status.enum';

export interface WorkOrderStatusChangeData {
  workOrderId: string;
  customerName: string;
  customerEmail: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: WorkOrderStatus;
  updatedAt: Date;
  estimatedCompletion?: Date;
  totalValue?: number;
  statusMessage?: string;
}

export abstract class WorkOrderNotificationPort {
  abstract sendStatusChangeNotification(data: WorkOrderStatusChangeData): Promise<void>;
}
