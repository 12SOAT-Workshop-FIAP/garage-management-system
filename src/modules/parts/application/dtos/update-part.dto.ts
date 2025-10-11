import { CreatePartDto } from './create-part.dto';

export class UpdatePartDto {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  costPrice?: number;
  minStockLevel?: number;
  unit?: string;
  supplier?: string;
  active?: boolean;
}

export class UpdateStockDto {
  quantity!: number;
}
