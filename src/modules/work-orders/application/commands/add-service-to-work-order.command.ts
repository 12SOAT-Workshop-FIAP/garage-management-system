export class AddServiceToWorkOrderCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly serviceId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
  ) {}
}
