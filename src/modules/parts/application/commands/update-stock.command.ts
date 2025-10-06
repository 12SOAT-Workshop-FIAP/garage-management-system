export class UpdateStockCommand {
  constructor(
    public readonly id: number,
    public readonly quantity: number,
  ) {}
}