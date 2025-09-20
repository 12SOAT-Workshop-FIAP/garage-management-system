import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendEmailNotificationService } from './application/services/send-email-notification.service';
import { WorkOrderEmailNotificationService } from './application/services/work-order-email-notification.service';
import { BrevoAdapter } from './adapters/BrevoAdapter';
import { TemplateAdapter } from './adapters/TemplateAdapter';

@Module({
  imports: [ConfigModule],
  providers: [
    SendEmailNotificationService,
    WorkOrderEmailNotificationService,
    {
      provide: 'EMAIL_ADAPTER',
      useClass: BrevoAdapter,
    },
    {
      provide: 'TEMPLATE_ADAPTER',
      useClass: TemplateAdapter,
    },
  ],
  exports: [SendEmailNotificationService, WorkOrderEmailNotificationService],
})
export class EmailModule {}
