export interface EmailRecipient {
  email: string;
  name: string;
}

export interface SendEmailRequest {
  recipients: EmailRecipient[];
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
}

export abstract class SendEmailNotificationPort {
  abstract execute(request: SendEmailRequest): Promise<void>;
}
