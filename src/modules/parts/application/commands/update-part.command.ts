export class UpdatePartCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly description?: string,
    public readonly category?: string,
    public readonly price?: number,
    public readonly costPrice?: number,
    public readonly minStockLevel?: number,
    public readonly unit?: string,
    public readonly supplier?: string,
  ) {}
}