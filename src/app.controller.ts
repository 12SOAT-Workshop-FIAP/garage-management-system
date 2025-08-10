import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './modules/auth/presentation/decorators/is-public.decorator';

@Controller()
export class AppController {
  @Get()
  @IsPublic()
  getHello(): string {
    return 'Hello World!';
  }
}
