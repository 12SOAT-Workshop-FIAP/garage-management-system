export class CreateWorkOrderCommand {
  constructor(
    public readonly customerId: number,
    public readonly vehicleId: number,
    public readonly description: string,
    public readonly estimatedCost?: number,
    public readonly diagnosis?: string,
  ) {}
}
