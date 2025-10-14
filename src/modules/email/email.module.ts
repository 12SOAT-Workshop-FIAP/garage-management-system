import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendEmailNotificationService } from './application/services/send-email-notification.service';
import { WorkOrderEmailNotificationService } from './application/services/work-order-email-notification.service';
import { BrevoAdapter } from './adapters/BrevoAdapter';
import { TemplateAdapter } from './adapters/TemplateAdapter';
import { SendEmailNotificationAdapter } from './adapters/send-email-notification.adapter';
import { SendEmailNotificationPort } from './ports/send-email-notification.port';
import { Email } from './ports/EmailPort';
import { TemplatePort } from './ports/TemplatePort';

@Module({
  imports: [ConfigModule],
  providers: [
    // Legacy services (mantidos para compatibilidade com código existente)
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
    {
      provide: SendEmailNotificationPort,
      useFactory: (emailAdapter: Email, templateAdapter: TemplatePort) => {
        return new SendEmailNotificationAdapter(emailAdapter, templateAdapter);
      },
      inject: ['EMAIL_ADAPTER', 'TEMPLATE_ADAPTER'],
    },
  ],
  exports: [
    // Legacy exports (para compatibilidade)
    SendEmailNotificationService,
    WorkOrderEmailNotificationService,
    // Hexagonal Architecture exports
    SendEmailNotificationPort,
  ],
})
export class EmailModule {}
