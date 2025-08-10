/**
 * WorkOrderPart (Value Object para Peças de Ordem de Serviço)
 * Represents a part associated with a work order in the domain layer.
 */
export class WorkOrderPart {
  constructor(
    public readonly partId: string,
    public readonly partName: string,
    public readonly partDescription: string,
    public readonly partNumber: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly notes?: string,
    public readonly isApproved: boolean = false,
    public readonly appliedAt?: Date,
  ) {
    this.validateQuantity();
    this.validatePrice();
  }

  /**
   * Calcula o preço total da peça (quantidade × preço unitário)
   */
  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  /**
   * Cria uma nova instância com quantidade atualizada
   */
  updateQuantity(newQuantity: number): WorkOrderPart {
    return new WorkOrderPart(
      this.partId,
      this.partName,
      this.partDescription,
      this.partNumber,
      newQuantity,
      this.unitPrice,
      this.notes,
      this.isApproved,
      this.appliedAt,
    );
  }

  /**
   * Cria uma nova instância com preço unitário atualizado
   */
  updateUnitPrice(newUnitPrice: number): WorkOrderPart {
    return new WorkOrderPart(
      this.partId,
      this.partName,
      this.partDescription,
      this.partNumber,
      this.quantity,
      newUnitPrice,
      this.notes,
      this.isApproved,
      this.appliedAt,
    );
  }

  /**
   * Marca a peça como aprovada
   */
  approve(): WorkOrderPart {
    return new WorkOrderPart(
      this.partId,
      this.partName,
      this.partDescription,
      this.partNumber,
      this.quantity,
      this.unitPrice,
      this.notes,
      true,
      this.appliedAt,
    );
  }

  /**
   * Marca a peça como aplicada
   */
  markAsApplied(): WorkOrderPart {
    return new WorkOrderPart(
      this.partId,
      this.partName,
      this.partDescription,
      this.partNumber,
      this.quantity,
      this.unitPrice,
      this.notes,
      this.isApproved,
      new Date(),
    );
  }

  private validateQuantity(): void {
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
  }

  private validatePrice(): void {
    if (this.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }
}
