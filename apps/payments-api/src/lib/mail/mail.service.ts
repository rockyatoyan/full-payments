import { PaymentSuccessTemplate } from './templates/payment-success.template';
import { User } from '@/api/auth/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MAIL_QUEUE_NAME, MailJobData } from './mail.constants';
import { Payment } from '@/api/payments/entities/payment.entity';
import { render } from '@react-email/components';
import PaymentFailTemplate from './templates/payment-fail.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue(MAIL_QUEUE_NAME) private mailQueue: Queue<MailJobData>,
  ) {}

  async sendPaymentSuccessEmail(user: User, payment: Payment) {
    const subject = 'Платеж успешно выполнен!';
    const html = await render(await PaymentSuccessTemplate({ payment }));

    const job = await this.mailQueue.add('send-mail', {
      to: user.email,
      subject,
      html,
    });

    return { ok: true, jobId: job.id };
  }

  async sendPaymentFailEmail(user: User, payment: Payment) {
    const subject = 'Платеж не выполнен!';
    const html = await render(await PaymentFailTemplate({ payment }));

    const job = await this.mailQueue.add('send-mail', {
      to: user.email,
      subject,
      html,
    });

    return { ok: true, jobId: job.id };
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      return { ok: true };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw new BadRequestException(
        `Failed to send email to ${to}: ${error.message}`,
      );
    }
  }
}
