import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePartDto {
  @ApiProperty({ description: 'Part name', example: 'Brake Pad' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Part description', example: 'Front brake pad for sedan' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Part number', example: 'BP-001' })
  @IsString()
  @IsNotEmpty()
  partNumber!: string;

  @ApiProperty({ description: 'Part category', example: 'Brakes' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ description: 'Part price', example: 50.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Part cost price', example: 30.50 })
  @IsNumber()
  @Min(0)
  costPrice!: number;

  @ApiProperty({ description: 'Stock quantity', example: 10 })
  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @ApiProperty({ description: 'Minimum stock level', example: 5 })
  @IsNumber()
  @Min(0)
  minStockLevel!: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'piece' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty({ description: 'Supplier name', example: 'Auto Parts Inc.' })
  @IsString()
  @IsNotEmpty()
  supplier!: string;

  @ApiProperty({ description: 'Part active status', example: true })
  @IsBoolean()
  active!: boolean;
}
