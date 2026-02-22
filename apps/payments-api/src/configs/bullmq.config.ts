import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { getRedisConfig } from './redis.config';

export const getBullMQConfig = (
  configService: ConfigService,
): BullRootModuleOptions => ({
  connection: {
    ...getRedisConfig(configService),
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
