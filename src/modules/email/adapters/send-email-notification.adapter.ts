import { Email, MailRequest } from '../ports/EmailPort';
import { TemplatePort } from '../ports/TemplatePort';
import { SendEmailNotificationPort, SendEmailRequest } from '../ports/send-email-notification.port';

export class SendEmailNotificationAdapter implements SendEmailNotificationPort {
  constructor(
    private readonly emailAdapter: Email,
    private readonly templateAdapter: TemplatePort,
  ) {}

  async execute(request: SendEmailRequest): Promise<void> {
    try {
      const html = this.templateAdapter.buildTemplate({
        templateName: request.templateName,
        templateData: request.templateData,
      });

      const mailRequest: MailRequest = {
        to: request.recipients.map((recipient) => ({
          email: recipient.email,
          name: recipient.name,
        })),
        subject: request.subject,
        html,
      };

      await this.emailAdapter.send(mailRequest);

      console.log(
        `✅ Email notification sent successfully to ${request.recipients.length} recipient(s)`,
      );
    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send email notification: ${errorMessage}`);
    }
  }
}
