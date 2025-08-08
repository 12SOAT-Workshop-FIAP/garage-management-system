import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @ApiProperty({ description: 'User full name' })
  name: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Authentication message' })
  message: string;

  constructor(
    user: { id: string; name: string; email: string; isActive: boolean },
    message: string = 'Authentication successful',
  ) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isActive = user.isActive;
    this.message = message;
  }
}
