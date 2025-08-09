/**
 * WorkOrderService Value Object
 * Represents a service included in a work order with its specific details
 */
export class WorkOrderService {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  estimatedDuration: number; // in minutes
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt?: Date;
  completedAt?: Date;
  technicianNotes?: string;

  constructor(props: {
    serviceId: string;
    serviceName: string;
    serviceDescription: string;
    quantity: number;
    unitPrice: number;
    estimatedDuration: number;
    technicianNotes?: string;
  }) {
    this.serviceId = props.serviceId;
    this.serviceName = props.serviceName;
    this.serviceDescription = props.serviceDescription;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.totalPrice = props.quantity * props.unitPrice;
    this.estimatedDuration = props.estimatedDuration;
    this.status = 'PENDING';
    this.technicianNotes = props.technicianNotes;
  }

  /**
   * Start service execution
   */
  start(): void {
    if (this.status !== 'PENDING') {
      throw new Error('Service can only be started when pending');
    }
    this.status = 'IN_PROGRESS';
    this.startedAt = new Date();
  }

  /**
   * Complete service execution
   */
  complete(technicianNotes?: string): void {
    if (this.status !== 'IN_PROGRESS') {
      throw new Error('Service can only be completed when in progress');
    }
    this.status = 'COMPLETED';
    this.completedAt = new Date();
    if (technicianNotes) {
      this.technicianNotes = technicianNotes;
    }
  }

  /**
   * Cancel service
   */
  cancel(): void {
    if (this.status === 'COMPLETED') {
      throw new Error('Cannot cancel a completed service');
    }
    this.status = 'CANCELLED';
  }

  /**
   * Update quantity and recalculate total price
   */
  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    this.quantity = newQuantity;
    this.totalPrice = this.quantity * this.unitPrice;
  }

  /**
   * Update unit price and recalculate total price
   */
  updateUnitPrice(newUnitPrice: number): void {
    if (newUnitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
    this.unitPrice = newUnitPrice;
    this.totalPrice = this.quantity * this.unitPrice;
  }

  /**
   * Get actual duration if completed
   */
  getActualDuration(): number | null {
    if (this.startedAt && this.completedAt) {
      return Math.floor((this.completedAt.getTime() - this.startedAt.getTime()) / (1000 * 60)); // in minutes
    }
    return null;
  }

  /**
   * Check if service is completed
   */
  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  /**
   * Check if service is in progress
   */
  isInProgress(): boolean {
    return this.status === 'IN_PROGRESS';
  }
}
