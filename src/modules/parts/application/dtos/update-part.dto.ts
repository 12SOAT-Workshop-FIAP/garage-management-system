import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Length, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * UpdatePartDto (DTO de atualização de Peça/Insumo)
 * Data Transfer Object for updating a part or supply item.
 */
export class UpdatePartDto {
  @ApiProperty({ 
    description: "Part name",
    example: "Brake Pad Set",
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiProperty({ 
    description: "Part description",
    example: "High performance ceramic brake pads for front wheels",
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ 
    description: "Manufacturer part number",
    example: "BP-001-CERAMIC",
    required: false,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  partNumber?: string;

  @ApiProperty({ 
    description: "Part category",
    example: "brake",
    enum: ['engine', 'brake', 'suspension', 'electrical', 'body', 'fluids', 'filters', 'other'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(['engine', 'brake', 'suspension', 'electrical', 'body', 'fluids', 'filters', 'other'])
  category?: string;

  @ApiProperty({ 
    description: "Unit price in currency",
    example: 89.99,
    minimum: 0,
    required: false
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiProperty({ 
    description: "Cost price for inventory control",
    example: 65.50,
    minimum: 0,
    required: false
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  costPrice?: number;

  @ApiProperty({ 
    description: "Minimum stock level for alerts",
    example: 5,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Min stock level must be a number' })
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  minStockLevel?: number;

  @ApiProperty({ 
    description: "Unit of measurement",
    example: "piece",
    enum: ['piece', 'liter', 'kg', 'meter', 'box', 'set'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(['piece', 'liter', 'kg', 'meter', 'box', 'set'])
  unit?: string;

  @ApiProperty({ 
    description: "Supplier information",
    example: "AutoParts Inc.",
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  supplier?: string;

  @ApiProperty({ 
    description: "Whether the part is active/available",
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;
}

/**
 * UpdateStockDto (DTO de atualização de estoque)
 * Data Transfer Object for updating stock quantity.
 */
export class UpdateStockDto {
  @ApiProperty({ 
    description: "Quantity to add or subtract from current stock (use negative for subtraction)",
    example: 10
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Transform(({ value }) => parseInt(value))
  quantity!: number;

  @ApiProperty({ 
    description: "Reason for stock update",
    example: "Received new stock from supplier",
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  reason?: string;
}
