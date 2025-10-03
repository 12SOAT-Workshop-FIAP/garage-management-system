import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'User name', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'User email', example: 'joao@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'User active status', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
