import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Service name', example: 'Oil change' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Service description', example: 'Change the oil' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Service active', example: true })
  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @ApiProperty({ description: 'Service duration', example: 30 })
  @IsInt()
  @Min(0)
  duration!: number;

  @ApiProperty({ description: 'Service price', example: 100 })
  @IsNumber()
  @Min(0)
  price!: number;
}
