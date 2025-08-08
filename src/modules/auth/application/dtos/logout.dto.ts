import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ description: 'Logout message' })
  message: string;

  constructor(message: string = 'Logout successful') {
    this.message = message;
  }
}
