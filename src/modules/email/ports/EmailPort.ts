type emailTo = {
  email: string;
  name: string;
};

export type MailRequest = {
  to: emailTo[];
  subject: string;
  html: string;
};

export interface Email {
  send(mailRequest: MailRequest): Promise<void>;
}
