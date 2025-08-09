import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { IsValidLicensePlate } from '@shared/validators/is-valid-license-plate.decorator';

export class CreateVehicleDto {
  @ApiProperty({ 
    description: "Vehicle's brand", 
    example: "Toyota",
    nullable: false 
  })
  @IsNotEmpty()
  @IsString()
  brand!: string;

  @ApiProperty({ 
    description: "Vehicle's model", 
    example: "Corolla",
    nullable: false 
  })
  @IsNotEmpty() 
  @IsString() 
  model!: string;

  @ApiProperty({ 
    description: "Vehicle's license plate (Brazilian format)", 
    example: "ABC-1234",
    pattern: "^[A-Z]{3}-?[0-9]{4}$|^[A-Z]{3}-?[0-9][A-Z][0-9]{2}$",
    nullable: false 
  })
  @IsNotEmpty() 
  @IsString() 
  @IsValidLicensePlate()
  plate!: string;

  @ApiProperty({ 
    description: "Vehicle's year", 
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
    nullable: false 
  })
  @IsNotEmpty() 
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @ApiProperty({ 
    description: "Customer ID", 
    example: 1,
    nullable: false 
  })
  @IsNotEmpty() 
  @IsNumber() 
  customerId!: number;
}
