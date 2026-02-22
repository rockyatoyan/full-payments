import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = (
  configService: ConfigService,
): MailerOptions => ({
  transport: {
    host: configService.getOrThrow<string>('MAILER_HOST'),
    port: configService.getOrThrow<number>('MAILER_PORT'),
    auth: {
      user: configService.getOrThrow<string>('MAILER_USER'),
      pass: configService.getOrThrow<string>('MAILER_PASSWORD'),
    },
  },
  defaults: {
    from: `"Full Payments" <${configService.getOrThrow<string>('MAILER_USER')}>`,
  },
});
