export const MAIL_QUEUE_NAME = 'mail';

export interface MailJobData {
  to: string;
  subject: string;
  html: string;
}
