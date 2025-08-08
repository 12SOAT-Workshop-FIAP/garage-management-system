import { randomUUID } from 'crypto';
import { WorkOrderStatus } from './work-order-status.enum';

/**
 * WorkOrder Domain Entity
 * Represents a work order in the garage (Ordem de Serviço da oficina mecânica).
 */
export class WorkOrder {
  id: string;
  customerId: string;
  vehicleId: string;
  description: string;
  status: WorkOrderStatus;
  estimatedCost: number;
  actualCost?: number;
  laborCost?: number;
  partsCost?: number;
  diagnosis?: string;
  technicianNotes?: string;
  customerApproval?: boolean;
  estimatedCompletionDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    customerId: string;
    vehicleId: string;
    description: string;
    estimatedCost?: number;
    diagnosis?: string;
  }, id?: string) {
    this.id = id ?? randomUUID();
    this.customerId = props.customerId;
    this.vehicleId = props.vehicleId;
    this.description = props.description;
    this.status = WorkOrderStatus.PENDING;
    this.estimatedCost = props.estimatedCost || 0;
    this.diagnosis = props.diagnosis;
    this.customerApproval = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update work order status
   */
  updateStatus(status: WorkOrderStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    
    if (status === WorkOrderStatus.COMPLETED) {
      this.completedAt = new Date();
    }
  }

  /**
   * Approve work order by customer
   */
  approveByCustomer(): void {
    if (this.status !== WorkOrderStatus.PENDING) {
      throw new Error('Work order can only be approved when pending');
    }
    this.customerApproval = true;
    this.status = WorkOrderStatus.APPROVED;
    this.updatedAt = new Date();
  }

  /**
   * Update actual costs
   */
  updateCosts(laborCost: number, partsCost: number): void {
    this.laborCost = laborCost;
    this.partsCost = partsCost;
    this.actualCost = laborCost + partsCost;
    this.updatedAt = new Date();
  }

  /**
   * Add technician notes
   */
  addTechnicianNotes(notes: string): void {
    this.technicianNotes = notes;
    this.updatedAt = new Date();
  }

  /**
   * Check if work order is ready to start
   */
  isReadyToStart(): boolean {
    return this.status === WorkOrderStatus.APPROVED && this.customerApproval === true;
  }

  /**
   * Check if work order is completed
   */
  isCompleted(): boolean {
    return this.status === WorkOrderStatus.COMPLETED || this.status === WorkOrderStatus.DELIVERED;
  }

  /**
   * Calculate total estimated time based on complexity
   */
  getEstimatedHours(): number {
    // Basic estimation based on cost (this could be more sophisticated)
    return Math.ceil(this.estimatedCost / 100); // 1 hour per 100 units of cost
  }
}
