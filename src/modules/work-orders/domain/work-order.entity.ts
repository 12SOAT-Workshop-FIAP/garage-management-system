import { randomUUID } from 'crypto';
import { WorkOrderStatus } from './work-order-status.enum';
import { WorkOrderService } from './work-order-service.value-object';
import { WorkOrderPart } from './work-order-part.value-object';

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
  services: WorkOrderService[]; // Serviços da ordem
  parts: WorkOrderPart[]; // Peças da ordem

  constructor(props: {
    customerId: string;
    vehicleId: string;
    description: string;
    estimatedCost?: number;
    diagnosis?: string;
    services?: WorkOrderService[];
    parts?: WorkOrderPart[];
  }, id?: string) {
    this.id = id ?? randomUUID();
    this.customerId = props.customerId;
    this.vehicleId = props.vehicleId;
    this.description = props.description;
    this.status = WorkOrderStatus.PENDING;
    this.estimatedCost = props.estimatedCost || 0;
    this.diagnosis = props.diagnosis;
    this.customerApproval = false;
    this.services = props.services || [];
    this.parts = props.parts || [];
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
    // Calculate based on services duration if available
    if (this.services.length > 0) {
      const totalMinutes = this.services.reduce((total, service) => {
        return total + (service.estimatedDuration * service.quantity);
      }, 0);
      return Math.ceil(totalMinutes / 60); // Convert to hours
    }
    
    // Fallback to cost-based estimation
    return Math.ceil(this.estimatedCost / 100); // 1 hour per 100 units of cost
  }

  /**
   * Add service to work order
   */
  addService(service: WorkOrderService): void {
    // Check if service already exists
    const existingService = this.services.find(s => s.serviceId === service.serviceId);
    if (existingService) {
      throw new Error(`Service ${service.serviceName} is already added to this work order`);
    }
    
    this.services.push(service);
    this.updateEstimatedCost();
    this.updatedAt = new Date();
  }

  /**
   * Remove service from work order
   */
  removeService(serviceId: string): void {
    const serviceIndex = this.services.findIndex(s => s.serviceId === serviceId);
    if (serviceIndex === -1) {
      throw new Error('Service not found in this work order');
    }
    
    this.services.splice(serviceIndex, 1);
    this.updateEstimatedCost();
    this.updatedAt = new Date();
  }

  /**
   * Update service in work order
   */
  updateService(serviceId: string, updates: { quantity?: number; unitPrice?: number; technicianNotes?: string }): void {
    const service = this.services.find(s => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }

    if (updates.quantity !== undefined) {
      service.updateQuantity(updates.quantity);
    }
    
    if (updates.unitPrice !== undefined) {
      service.updateUnitPrice(updates.unitPrice);
    }
    
    if (updates.technicianNotes !== undefined) {
      service.technicianNotes = updates.technicianNotes;
    }

    this.updateEstimatedCost();
    this.updatedAt = new Date();
  }

  /**
   * Start service execution
   */
  startService(serviceId: string): void {
    const service = this.services.find(s => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }
    
    service.start();
    this.updatedAt = new Date();
  }

  /**
   * Complete service execution
   */
  completeService(serviceId: string, technicianNotes?: string): void {
    const service = this.services.find(s => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }
    
    service.complete(technicianNotes);
    this.updateActualCost();
    this.updatedAt = new Date();

    // Check if all services are completed
    if (this.areAllServicesCompleted()) {
      this.updateStatus(WorkOrderStatus.COMPLETED);
    }
  }

  /**
   * Cancel service
   */
  cancelService(serviceId: string): void {
    const service = this.services.find(s => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }
    
    service.cancel();
    this.updateEstimatedCost();
    this.updatedAt = new Date();
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): WorkOrderService | undefined {
    return this.services.find(s => s.serviceId === serviceId);
  }

  /**
   * Get all services by status
   */
  getServicesByStatus(status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'): WorkOrderService[] {
    return this.services.filter(s => s.status === status);
  }

  /**
   * Calculate total services cost
   */
  getTotalServicesCost(): number {
    return this.services
      .filter(s => s.status !== 'CANCELLED')
      .reduce((total, service) => total + service.totalPrice, 0);
  }

  /**
   * Check if all services are completed
   */
  areAllServicesCompleted(): boolean {
    if (this.services.length === 0) return false;
    return this.services.every(s => s.status === 'COMPLETED' || s.status === 'CANCELLED');
  }

  /**
   * Get completion percentage based on services
   */
  getCompletionPercentage(): number {
    if (this.services.length === 0) return 0;
    
    const completedServices = this.services.filter(s => s.status === 'COMPLETED').length;
    return Math.round((completedServices / this.services.length) * 100);
  }

  /**
   * Update estimated cost based on services and parts
   */
  private updateEstimatedCost(): void {
    const servicesCost = this.getTotalServicesCost();
    const partsCost = this.getTotalPartsCost();
    this.estimatedCost = servicesCost + partsCost;
  }

  /**
   * Update actual cost based on completed services
   */
  private updateActualCost(): void {
    const completedServicesCost = this.services
      .filter(s => s.status === 'COMPLETED')
      .reduce((total, service) => total + service.totalPrice, 0);
    
    const appliedPartsCost = this.getAppliedPartsCost();
    
    this.actualCost = completedServicesCost + appliedPartsCost;
    this.laborCost = completedServicesCost;
    this.partsCost = appliedPartsCost;
  }

  /**
   * Add a part to the work order
   */
  addPart(part: WorkOrderPart): void {
    // Check if part already exists and update quantity instead
    const existingPartIndex = this.parts.findIndex(p => p.partId === part.partId);
    
    if (existingPartIndex >= 0) {
      const existingPart = this.parts[existingPartIndex];
      const newQuantity = existingPart.quantity + part.quantity;
      this.parts[existingPartIndex] = existingPart.updateQuantity(newQuantity);
    } else {
      this.parts.push(part);
    }
    
    this.updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Remove a part from the work order
   */
  removePart(partId: string): void {
    this.parts = this.parts.filter(part => part.partId !== partId);
    this.updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Update part quantity
   */
  updatePartQuantity(partId: string, newQuantity: number): void {
    const partIndex = this.parts.findIndex(p => p.partId === partId);
    
    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    if (newQuantity <= 0) {
      this.removePart(partId);
      return;
    }

    this.parts[partIndex] = this.parts[partIndex].updateQuantity(newQuantity);
    this.updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Approve a part for use
   */
  approvePart(partId: string): void {
    const partIndex = this.parts.findIndex(p => p.partId === partId);
    
    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    this.parts[partIndex] = this.parts[partIndex].approve();
    this.updatedAt = new Date();
  }

  /**
   * Mark a part as applied
   */
  applyPart(partId: string): void {
    const partIndex = this.parts.findIndex(p => p.partId === partId);
    
    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    if (!this.parts[partIndex].isApproved) {
      throw new Error('Part must be approved before it can be applied');
    }

    this.parts[partIndex] = this.parts[partIndex].markAsApplied();
    this.updatedAt = new Date();
    this.updateActualCost();
  }

  /**
   * Get total cost of all parts (estimated)
   */
  getTotalPartsCost(): number {
    return this.parts.reduce((total, part) => total + part.totalPrice, 0);
  }

  /**
   * Get total cost of applied parts only
   */
  getAppliedPartsCost(): number {
    return this.parts
      .filter(part => part.appliedAt)
      .reduce((total, part) => total + part.totalPrice, 0);
  }

  /**
   * Get parts by approval status
   */
  getPartsByApprovalStatus(isApproved: boolean): WorkOrderPart[] {
    return this.parts.filter(part => part.isApproved === isApproved);
  }

  /**
   * Check if all parts are approved
   */
  areAllPartsApproved(): boolean {
    return this.parts.length > 0 && this.parts.every(part => part.isApproved);
  }
}
