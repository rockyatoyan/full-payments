import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from '@/configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { MAIL_QUEUE_NAME } from './mail.constants';
import { MailWorker } from './mail.worker';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailerConfig,
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE_NAME,
    }),
  ],
  providers: [MailService, MailWorker],
  exports: [MailService],
})
export class MailModule {}
