export class UpdateStockCommand {
  constructor(
    public readonly id: string,
    public readonly quantity: number,
  ) {}
}