import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  async transform(value?: string) {
    if (!value) {
      return;
    }

    const rounds = Number(this.configService.get('BCRYPT_ROUNDS')) || 10;
    return hash(value, rounds);
  }
}
