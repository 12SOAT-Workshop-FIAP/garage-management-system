import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'ABC1D23' })
  @IsOptional()
  @IsString()
  plate?: string;

  @ApiPropertyOptional({ example: 'Fiat' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Punto' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2019, minimum: 1900 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiPropertyOptional({ example: 77 })
  @IsOptional()
  @IsInt()
  customerId?: number;

  @ApiPropertyOptional({ example: 'Preto' })
  @IsOptional()
  @IsString()
  color?: string | null;
}
