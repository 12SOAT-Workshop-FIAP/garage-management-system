export class CreatePartCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly partNumber: string,
    public readonly category: string,
    public readonly price: number,
    public readonly costPrice: number,
    public readonly stockQuantity: number,
    public readonly minStockLevel: number,
    public readonly unit: string,
    public readonly supplier: string,
  ) {}
}