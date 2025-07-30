import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Length, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * CreatePartDto (DTO de criação de Peça/Insumo)
 * Data Transfer Object for creating a part or supply item.
 */
export class CreatePartDto {
  @ApiProperty({ 
    description: "Part name",
    example: "Brake Pad Set",
    maxLength: 100
  })
  @IsString()
  @Length(2, 100)
  name!: string;

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
    enum: ['engine', 'brake', 'suspension', 'electrical', 'body', 'fluids', 'filters', 'other']
  })
  @IsString()
  @IsEnum(['engine', 'brake', 'suspension', 'electrical', 'body', 'fluids', 'filters', 'other'])
  category!: string;

  @ApiProperty({ 
    description: "Unit price in currency",
    example: 89.99,
    minimum: 0
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price!: number;

  @ApiProperty({ 
    description: "Cost price for inventory control",
    example: 65.50,
    minimum: 0
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  costPrice!: number;

  @ApiProperty({ 
    description: "Current stock quantity",
    example: 25,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber({}, { message: 'Stock quantity must be a number' })
  @Min(0)
  @Transform(({ value }) => parseInt(value) || 0)
  stockQuantity?: number = 0;

  @ApiProperty({ 
    description: "Minimum stock level for alerts",
    example: 5,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber({}, { message: 'Min stock level must be a number' })
  @Min(1)
  @Transform(({ value }) => parseInt(value) || 1)
  minStockLevel?: number = 1;

  @ApiProperty({ 
    description: "Unit of measurement",
    example: "piece",
    enum: ['piece', 'liter', 'kg', 'meter', 'box', 'set'],
    default: 'piece'
  })
  @IsOptional()
  @IsString()
  @IsEnum(['piece', 'liter', 'kg', 'meter', 'box', 'set'])
  unit?: string = 'piece';

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
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean = true;
}
