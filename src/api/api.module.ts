import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { SubsriptionsModule } from './subsriptions/subsriptions.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [AuthModule, UsersModule, PlansModule, SubsriptionsModule, PaymentsModule]
})
export class ApiModule {}
