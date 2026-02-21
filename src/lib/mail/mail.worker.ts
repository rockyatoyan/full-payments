import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE_NAME, MailJobData } from './mail.constants';
import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';

@Processor(MAIL_QUEUE_NAME)
@Injectable()
export class MailWorker extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailJobData, any, string>): Promise<any> {
    const { to, subject, html } = job.data;
    return await this.mailService.sendMail(to, subject, html);
  }
}
