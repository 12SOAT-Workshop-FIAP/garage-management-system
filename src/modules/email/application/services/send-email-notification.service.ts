import { Injectable, Inject } from '@nestjs/common';
import { Email, MailRequest } from '../../ports/EmailPort';
import { TemplatePort } from '../../ports/TemplatePort';
import { SendEmailNotificationDto } from '../dtos/send-email-notification.dto';

/**
 * SendEmailNotificationService
 * @deprecated Use SendEmailNotificationPort with dependency injection instead
 * Legacy service maintained for backward compatibility
 * This will be removed in a future version
 */
@Injectable()
export class SendEmailNotificationService {
  constructor(
    @Inject('EMAIL_ADAPTER') private readonly emailAdapter: Email,
    @Inject('TEMPLATE_ADAPTER') private readonly templateAdapter: TemplatePort,
  ) {}

  async execute(dto: SendEmailNotificationDto): Promise<void> {
    try {
      const html = this.templateAdapter.buildTemplate({
        templateName: dto.templateName,
        templateData: dto.templateData,
      });

      const mailRequest: MailRequest = {
        to: dto.recipients.map((recipient) => ({
          email: recipient.email,
          name: recipient.name,
        })),
        subject: dto.subject,
        html,
      };

      await this.emailAdapter.send(mailRequest);

      console.log(`Email notification sent successfully to ${dto.recipients.length} recipient(s)`);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send email notification: ${errorMessage}`);
    }
  }
}
