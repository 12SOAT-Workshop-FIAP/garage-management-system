import { PartId } from '../value-objects/part-id.vo';
import { PartName } from '../value-objects/part-name.vo';
import { PartDescription } from '../value-objects/part-description.vo';
import { PartNumber } from '../value-objects/part-number.vo';
import { PartCategory } from '../value-objects/part-category.vo';
import { Money } from '../value-objects/money.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { PartUnit } from '../value-objects/part-unit.vo';
import { PartSupplier } from '../value-objects/part-supplier.vo';
import { PartStatus } from '../value-objects/part-status.vo';

export class Part {
  private _id?: PartId;
  private _name: PartName;
  private _description: PartDescription;
  private _partNumber: PartNumber;
  private _category: PartCategory;
  private _price: Money;
  private _costPrice: Money;
  private _stockQuantity: StockQuantity;
  private _minStockLevel: number;
  private _unit: PartUnit;
  private _supplier: PartSupplier;
  private _status: PartStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    id,
    name,
    description,
    partNumber,
    category,
    price,
    costPrice,
    stockQuantity,
    minStockLevel,
    unit,
    supplier,
    active = true,
    createdAt,
    updatedAt,
  }: {
    id?: number;
    name: string;
    description: string;
    partNumber: string;
    category: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    unit: string;
    supplier: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._name = new PartName(name);
    this._description = new PartDescription(description);
    this._partNumber = new PartNumber(partNumber);
    this._category = new PartCategory(category);
    this._price = new Money(price);
    this._costPrice = new Money(costPrice);
    this._stockQuantity = new StockQuantity(stockQuantity);
    this._minStockLevel = minStockLevel;
    this._unit = new PartUnit(unit);
    this._supplier = new PartSupplier(supplier);
    this._status = new PartStatus(active);
    
    if (id) {
      this._id = new PartId(id);
    }

    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  static create({
    name,
    description,
    partNumber,
    category,
    price,
    costPrice,
    stockQuantity,
    minStockLevel,
    unit,
    supplier,
  }: {
    name: string;
    description: string;
    partNumber: string;
    category: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    unit: string;
    supplier: string;
  }): Part {
    return new Part({
      name,
      description,
      partNumber,
      category,
      price,
      costPrice,
      stockQuantity,
      minStockLevel,
      unit,
      supplier,
      active: true,
    });
  }

  static restore({
    id,
    name,
    description,
    partNumber,
    category,
    price,
    costPrice,
    stockQuantity,
    minStockLevel,
    unit,
    supplier,
    active,
    createdAt,
    updatedAt,
  }: {
    id: number;
    name: string;
    description: string;
    partNumber: string;
    category: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    unit: string;
    supplier: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Part {
    return new Part({
      id,
      name,
      description,
      partNumber,
      category,
      price,
      costPrice,
      stockQuantity,
      minStockLevel,
      unit,
      supplier,
      active,
      createdAt,
      updatedAt,
    });
  }

  // Getters
  get id(): PartId | undefined {
    return this._id;
  }

  get name(): PartName {
    return this._name;
  }

  get description(): PartDescription {
    return this._description;
  }

  get partNumber(): PartNumber {
    return this._partNumber;
  }

  get category(): PartCategory {
    return this._category;
  }

  get price(): Money {
    return this._price;
  }

  get costPrice(): Money {
    return this._costPrice;
  }

  get stockQuantity(): StockQuantity {
    return this._stockQuantity;
  }

  get minStockLevel(): number {
    return this._minStockLevel;
  }

  get unit(): PartUnit {
    return this._unit;
  }

  get supplier(): PartSupplier {
    return this._supplier;
  }

  get status(): PartStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isActive(): boolean {
    return this._status.isActive;
  }

  // Business methods
  updateStock(quantity: number): void {
    this._stockQuantity = this._stockQuantity.add(quantity);
    this._updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    this._stockQuantity = this._stockQuantity.subtract(quantity);
    this._updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this._stockQuantity.isLowStock(this._minStockLevel);
  }

  updatePrice(newPrice: number): void {
    this._price = new Money(newPrice);
    this._updatedAt = new Date();
  }

  updateCostPrice(newCostPrice: number): void {
    this._costPrice = new Money(newCostPrice);
    this._updatedAt = new Date();
  }

  activate(): void {
    this._status = this._status.activate();
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._status = this._status.deactivate();
    this._updatedAt = new Date();
  }

  update({
    name,
    description,
    category,
    price,
    costPrice,
    minStockLevel,
    unit,
    supplier,
  }: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    costPrice?: number;
    minStockLevel?: number;
    unit?: string;
    supplier?: string;
  }): void {
    if (name) this._name = new PartName(name);
    if (description) this._description = new PartDescription(description);
    if (category) this._category = new PartCategory(category);
    if (price !== undefined) this._price = new Money(price);
    if (costPrice !== undefined) this._costPrice = new Money(costPrice);
    if (minStockLevel !== undefined) this._minStockLevel = minStockLevel;
    if (unit) this._unit = new PartUnit(unit);
    if (supplier) this._supplier = new PartSupplier(supplier);
    
    this._updatedAt = new Date();
  }


}
