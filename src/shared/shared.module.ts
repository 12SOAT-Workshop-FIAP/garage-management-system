import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './infrastructure/winston-logger.service';
import { NewRelicService } from './infrastructure/new-relic.service';
import { HealthController } from './infrastructure/health/health.controller';
import { MessagingModule } from './messaging/messaging.module';


@Global()
@Module({
  imports: [MessagingModule],
  controllers: [HealthController],
  providers: [WinstonLoggerService, NewRelicService],
  exports: [WinstonLoggerService, NewRelicService, MessagingModule],
})
export class SharedModule {}

