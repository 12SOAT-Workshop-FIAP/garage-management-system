export class AddPartToWorkOrderCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly partId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
  ) {}
}
