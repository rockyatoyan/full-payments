import { Module } from '@nestjs/common';
import { YoukassaService } from './youkassa.service';
import { YookassaModule } from 'nestjs-yookassa';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        shopId: configService.getOrThrow<string>('YOOKASSA_SHOP_ID')!,
        apiKey: configService.getOrThrow<string>('YOOKASSA_SECRET_KEY')!,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [YoukassaService],
  exports: [YoukassaService],
})
export class YoukassaModule {}
