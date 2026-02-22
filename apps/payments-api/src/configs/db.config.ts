import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '@/api/auth/entities/user.entity'
import { Payment } from '@/api/payments/entities/payment.entity'
import { Subscription } from '@/api/subsriptions/entities/subscription.entity'
import { Plan } from '@/api/plans/entities/plan.entity'

export * from "pg"

export const getDbFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',

  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),

  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),

  synchronize: false,

  entities: [User, Payment, Subscription, Plan],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
});
