import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC1D23' })
  @IsString()
  @IsNotEmpty()
  plate!: string;

  @ApiProperty({ example: 'Fiat' })
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @ApiProperty({ example: 'Punto' })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({ example: 2018, minimum: 1900 })
  @IsInt()
  @Min(1900)
  year!: number;

  @ApiProperty({ example: 42 })
  @IsInt()
  customerId!: number;

  @ApiPropertyOptional({ example: 'Prata' })
  @IsOptional()
  @IsString()
  color?: string | null;
}
