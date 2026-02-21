import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { getBullMQConfig } from '@/configs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getBullMQConfig,
      inject: [ConfigService],
    }),
  ],
})
export class LibModule {}
