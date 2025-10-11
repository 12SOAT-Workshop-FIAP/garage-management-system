import { Injectable } from '@nestjs/common';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptographyAdapter implements CryptographyPort {
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
