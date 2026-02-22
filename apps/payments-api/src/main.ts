import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGINS').split(','),
    credentials: true,
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.set('trust proxy', true);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HOST');

  try {
    await app.listen(port);
    logger.log(`Application is running on: ${host}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
