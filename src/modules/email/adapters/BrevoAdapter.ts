import { Email, MailRequest } from '../ports/EmailPort';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

export class BrevoAdapter implements Email {
  constructor(private emailApi: TransactionalEmailsApi) {
    this.emailApi = new TransactionalEmailsApi();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error(
        'BREVO_API_KEY environment variable is not set. Please provide your Brevo API key to enable email sending. 🔑✉️',
      );
    }

    this.emailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }
  async send({ to, subject, html }: MailRequest): Promise<void> {
    await this.emailApi.sendTransacEmail({
      sender: { email: process.env.EMAIL_SENDER, name: process.env.SENDER_NAME },
      to,
      subject,
      htmlContent: html,
    });
  }
}
