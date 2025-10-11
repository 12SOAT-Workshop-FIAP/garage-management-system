export class CreateWorkOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly vehicleId: string,
    public readonly description: string,
    public readonly estimatedCost?: number,
    public readonly diagnosis?: string,
  ) {}
}
