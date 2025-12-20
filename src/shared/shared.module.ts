import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './infrastructure/winston-logger.service';
import { NewRelicService } from './infrastructure/new-relic.service';
import { HealthController } from './infrastructure/health/health.controller';


@Global()
@Module({
  controllers: [HealthController],
  providers: [WinstonLoggerService, NewRelicService],
  exports: [WinstonLoggerService, NewRelicService],
})
export class SharedModule {}
