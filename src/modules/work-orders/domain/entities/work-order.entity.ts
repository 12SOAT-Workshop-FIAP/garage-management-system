import { WorkOrderStatus } from '../work-order-status.enum';
import { WorkOrderService } from '../work-order-service.value-object';
import { WorkOrderPart } from '../work-order-part.value-object';
import {
  WorkOrderId,
  WorkOrderDescription,
  Money,
  WorkOrderDiagnosis,
  TechnicianNotes,
} from '../value-objects';

/**
 * WorkOrder Domain Entity
 * Represents a work order in the garage (Ordem de Serviço da oficina mecânica).
 * Follows hexagonal architecture with value objects for domain primitives.
 */
export class WorkOrder {
  private readonly _id: WorkOrderId;
  private readonly _customerId: number;
  private readonly _vehicleId: number;
  private _description: WorkOrderDescription;
  private _status: WorkOrderStatus;
  private _estimatedCost: Money;
  private _actualCost?: Money;
  private _laborCost?: Money;
  private _partsCost?: Money;
  private _diagnosis?: WorkOrderDiagnosis;
  private _technicianNotes?: TechnicianNotes;
  private _customerApproval: boolean;
  private _estimatedCompletionDate?: Date;
  private _completedAt?: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _services: WorkOrderService[];
  private _parts: WorkOrderPart[];

  private constructor(props: {
    id: WorkOrderId;
    customerId: number;
    vehicleId: number;
    description: WorkOrderDescription;
    status?: WorkOrderStatus;
    estimatedCost?: Money;
    actualCost?: Money;
    laborCost?: Money;
    partsCost?: Money;
    diagnosis?: WorkOrderDiagnosis;
    technicianNotes?: TechnicianNotes;
    customerApproval?: boolean;
    estimatedCompletionDate?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    services?: WorkOrderService[];
    parts?: WorkOrderPart[];
  }) {
    this._id = props.id;
    this._customerId = props.customerId;
    this._vehicleId = props.vehicleId;
    this._description = props.description;
    this._status = props.status ?? WorkOrderStatus.PENDING;
    this._estimatedCost = props.estimatedCost ?? Money.zero();
    this._actualCost = props.actualCost;
    this._laborCost = props.laborCost;
    this._partsCost = props.partsCost;
    this._diagnosis = props.diagnosis;
    this._technicianNotes = props.technicianNotes;
    this._customerApproval = props.customerApproval ?? false;
    this._estimatedCompletionDate = props.estimatedCompletionDate;
    this._completedAt = props.completedAt;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._services = props.services ?? [];
    this._parts = props.parts ?? [];
  }

  static create(props: {
    customerId: number;
    vehicleId: number;
    description: string;
    estimatedCost?: number;
    diagnosis?: string;
    services?: WorkOrderService[];
    parts?: WorkOrderPart[];
  }): WorkOrder {
    return new WorkOrder({
      id: WorkOrderId.create(),
      customerId: props.customerId,
      vehicleId: props.vehicleId,
      description: WorkOrderDescription.create(props.description),
      estimatedCost: props.estimatedCost ? Money.create(props.estimatedCost) : Money.zero(),
      diagnosis: props.diagnosis ? WorkOrderDiagnosis.create(props.diagnosis) : undefined,
      services: props.services,
      parts: props.parts,
    });
  }

  static reconstitute(props: {
    id: string;
    customerId: number;
    vehicleId: number;
    description: string;
    status: WorkOrderStatus;
    estimatedCost: number;
    actualCost?: number;
    laborCost?: number;
    partsCost?: number;
    diagnosis?: string;
    technicianNotes?: string;
    customerApproval: boolean;
    estimatedCompletionDate?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    services?: WorkOrderService[];
    parts?: WorkOrderPart[];
  }): WorkOrder {
    return new WorkOrder({
      id: WorkOrderId.create(props.id),
      customerId: props.customerId,
      vehicleId: props.vehicleId,
      description: WorkOrderDescription.create(props.description),
      status: props.status,
      estimatedCost: Money.create(props.estimatedCost),
      actualCost: props.actualCost !== undefined ? Money.create(props.actualCost) : undefined,
      laborCost: props.laborCost !== undefined ? Money.create(props.laborCost) : undefined,
      partsCost: props.partsCost !== undefined ? Money.create(props.partsCost) : undefined,
      diagnosis: props.diagnosis ? WorkOrderDiagnosis.create(props.diagnosis) : undefined,
      technicianNotes: props.technicianNotes
        ? TechnicianNotes.create(props.technicianNotes)
        : undefined,
      customerApproval: props.customerApproval,
      estimatedCompletionDate: props.estimatedCompletionDate,
      completedAt: props.completedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      services: props.services,
      parts: props.parts,
    });
  }

  // Getters
  get id(): WorkOrderId {
    return this._id;
  }

  get customerId(): number {
    return this._customerId;
  }

  get vehicleId(): number {
    return this._vehicleId;
  }

  get description(): WorkOrderDescription {
    return this._description;
  }

  get status(): WorkOrderStatus {
    return this._status;
  }

  get estimatedCost(): Money {
    return this._estimatedCost;
  }

  get actualCost(): Money | undefined {
    return this._actualCost;
  }

  get laborCost(): Money | undefined {
    return this._laborCost;
  }

  get partsCost(): Money | undefined {
    return this._partsCost;
  }

  get diagnosis(): WorkOrderDiagnosis | undefined {
    return this._diagnosis;
  }

  get technicianNotes(): TechnicianNotes | undefined {
    return this._technicianNotes;
  }

  get customerApproval(): boolean {
    return this._customerApproval;
  }

  get estimatedCompletionDate(): Date | undefined {
    return this._estimatedCompletionDate;
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get services(): WorkOrderService[] {
    return [...this._services];
  }

  get parts(): WorkOrderPart[] {
    return [...this._parts];
  }

  /**
   * Update work order status
   */
  updateStatus(status: WorkOrderStatus): void {
    this._status = status;
    this._updatedAt = new Date();

    if (status === WorkOrderStatus.COMPLETED) {
      this._completedAt = new Date();
    }
  }

  /**
   * Approve work order by customer
   */
  approveByCustomer(): void {
    if (this._status !== WorkOrderStatus.PENDING) {
      throw new Error('Work order can only be approved when pending');
    }
    this._customerApproval = true;
    this._status = WorkOrderStatus.APPROVED;
    this._updatedAt = new Date();
  }

  /**
   * Update actual costs
   */
  updateCosts(laborCost: Money, partsCost: Money): void {
    this._laborCost = laborCost;
    this._partsCost = partsCost;
    this._actualCost = laborCost.add(partsCost);
    this._updatedAt = new Date();
  }

  /**
   * Add technician notes
   */
  addTechnicianNotes(notes: string): void {
    this._technicianNotes = TechnicianNotes.create(notes);
    this._updatedAt = new Date();
  }

  /**
   * Update description
   */
  updateDescription(description: string): void {
    this._description = WorkOrderDescription.create(description);
    this._updatedAt = new Date();
  }

  /**
   * Update diagnosis
   */
  updateDiagnosis(diagnosis: string): void {
    this._diagnosis = WorkOrderDiagnosis.create(diagnosis);
    this._updatedAt = new Date();
  }

  /**
   * Check if work order is ready to start
   */
  isReadyToStart(): boolean {
    return this._status === WorkOrderStatus.APPROVED && this._customerApproval === true;
  }

  /**
   * Check if work order is completed
   */
  isCompleted(): boolean {
    return this._status === WorkOrderStatus.COMPLETED || this._status === WorkOrderStatus.DELIVERED;
  }

  /**
   * Calculate total estimated time based on complexity
   */
  getEstimatedHours(): number {
    if (this._services.length > 0) {
      const totalMinutes = this._services.reduce((total, service) => {
        return total + service.estimatedDuration * service.quantity;
      }, 0);
      return Math.ceil(totalMinutes / 60);
    }

    return Math.ceil(this._estimatedCost.value / 100);
  }

  /**
   * Add service to work order
   */
  addService(service: WorkOrderService): void {
    const existingService = this._services.find((s) => s.serviceId === service.serviceId);
    if (existingService) {
      throw new Error(`Service ${service.serviceName} is already added to this work order`);
    }

    this._services.push(service);
    this.updateEstimatedCost();
    this._updatedAt = new Date();
  }

  /**
   * Remove service from work order
   */
  removeService(serviceId: string): void {
    const serviceIndex = this._services.findIndex((s) => s.serviceId === serviceId);
    if (serviceIndex === -1) {
      throw new Error('Service not found in this work order');
    }

    this._services.splice(serviceIndex, 1);
    this.updateEstimatedCost();
    this._updatedAt = new Date();
  }

  /**
   * Update service in work order
   */
  updateService(
    serviceId: string,
    updates: { quantity?: number; unitPrice?: number; technicianNotes?: string },
  ): void {
    const service = this._services.find((s) => s.serviceId === serviceId);
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
    this._updatedAt = new Date();
  }

  /**
   * Start service execution
   */
  startService(serviceId: string): void {
    const service = this._services.find((s) => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }

    service.start();
    this._updatedAt = new Date();
  }

  /**
   * Complete service execution
   */
  completeService(serviceId: string, technicianNotes?: string): void {
    const service = this._services.find((s) => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }

    service.complete(technicianNotes);
    this.updateActualCost();
    this._updatedAt = new Date();

    if (this.areAllServicesCompleted()) {
      this.updateStatus(WorkOrderStatus.COMPLETED);
    }
  }

  /**
   * Cancel service
   */
  cancelService(serviceId: string): void {
    const service = this._services.find((s) => s.serviceId === serviceId);
    if (!service) {
      throw new Error('Service not found in this work order');
    }

    service.cancel();
    this.updateEstimatedCost();
    this._updatedAt = new Date();
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): WorkOrderService | undefined {
    return this._services.find((s) => s.serviceId === serviceId);
  }

  /**
   * Get all services by status
   */
  getServicesByStatus(
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ): WorkOrderService[] {
    return this._services.filter((s) => s.status === status);
  }

  /**
   * Calculate total services cost
   */
  getTotalServicesCost(): number {
    return this._services
      .filter((s) => s.status !== 'CANCELLED')
      .reduce((total, service) => total + service.totalPrice, 0);
  }

  /**
   * Check if all services are completed
   */
  areAllServicesCompleted(): boolean {
    if (this._services.length === 0) return false;
    return this._services.every((s) => s.status === 'COMPLETED' || s.status === 'CANCELLED');
  }

  /**
   * Get completion percentage based on services
   */
  getCompletionPercentage(): number {
    if (this._services.length === 0) return 0;

    const completedServices = this._services.filter((s) => s.status === 'COMPLETED').length;
    return Math.round((completedServices / this._services.length) * 100);
  }

  /**
   * Update estimated cost based on services and parts
   */
  private updateEstimatedCost(): void {
    const servicesCost = this.getTotalServicesCost();
    const partsCost = this.getTotalPartsCost();
    this._estimatedCost = Money.create(servicesCost + partsCost);
  }

  /**
   * Update actual cost based on completed services
   */
  private updateActualCost(): void {
    const completedServicesCost = this._services
      .filter((s) => s.status === 'COMPLETED')
      .reduce((total, service) => total + service.totalPrice, 0);

    const appliedPartsCost = this.getAppliedPartsCost();

    this._actualCost = Money.create(completedServicesCost + appliedPartsCost);
    this._laborCost = Money.create(completedServicesCost);
    this._partsCost = Money.create(appliedPartsCost);
  }

  /**
   * Add a part to the work order
   */
  addPart(part: WorkOrderPart): void {
    const existingPartIndex = this._parts.findIndex((p) => p.partId === part.partId);

    if (existingPartIndex >= 0) {
      const existingPart = this._parts[existingPartIndex];
      const newQuantity = existingPart.quantity + part.quantity;
      this._parts[existingPartIndex] = existingPart.updateQuantity(newQuantity);
    } else {
      this._parts.push(part);
    }

    this._updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Remove a part from the work order
   */
  removePart(partId: string): void {
    this._parts = this._parts.filter((part) => part.partId !== partId);
    this._updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Update part quantity
   */
  updatePartQuantity(partId: string, newQuantity: number): void {
    const partIndex = this._parts.findIndex((p) => p.partId === partId);

    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    if (newQuantity <= 0) {
      this.removePart(partId);
      return;
    }

    this._parts[partIndex] = this._parts[partIndex].updateQuantity(newQuantity);
    this._updatedAt = new Date();
    this.updateEstimatedCost();
  }

  /**
   * Approve a part for use
   */
  approvePart(partId: string): void {
    const partIndex = this._parts.findIndex((p) => p.partId === partId);

    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    this._parts[partIndex] = this._parts[partIndex].approve();
    this._updatedAt = new Date();
  }

  /**
   * Mark a part as applied
   */
  applyPart(partId: string): void {
    const partIndex = this._parts.findIndex((p) => p.partId === partId);

    if (partIndex === -1) {
      throw new Error(`Part with ID ${partId} not found in work order`);
    }

    if (!this._parts[partIndex].isApproved) {
      throw new Error('Part must be approved before it can be applied');
    }

    this._parts[partIndex] = this._parts[partIndex].markAsApplied();
    this._updatedAt = new Date();
    this.updateActualCost();
  }

  /**
   * Get total cost of all parts (estimated)
   */
  getTotalPartsCost(): number {
    return this._parts.reduce((total, part) => total + part.totalPrice, 0);
  }

  /**
   * Get total cost of applied parts only
   */
  getAppliedPartsCost(): number {
    return this._parts
      .filter((part) => part.appliedAt)
      .reduce((total, part) => total + part.totalPrice, 0);
  }

  /**
   * Get parts by approval status
   */
  getPartsByApprovalStatus(isApproved: boolean): WorkOrderPart[] {
    return this._parts.filter((part) => part.isApproved === isApproved);
  }

  /**
   * Check if all parts are approved
   */
  areAllPartsApproved(): boolean {
    return this._parts.length > 0 && this._parts.every((part) => part.isApproved);
  }
}
