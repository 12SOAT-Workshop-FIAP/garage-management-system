export class PartOrmEntity {
  id!: string;
  name!: string;
  description!: string;
  partNumber!: string;
  category!: string;
  price!: number;
  costPrice!: number;
  stockQuantity!: number;
  minStockLevel!: number;
  unit!: string;
  supplier!: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
