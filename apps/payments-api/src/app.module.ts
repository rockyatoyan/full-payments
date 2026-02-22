import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbFactory } from './configs';
import { ApiModule } from './api/api.module';
import { LibModule } from './lib/lib.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDbFactory,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ApiModule,
    LibModule,
  ],
})
export class AppModule {}
