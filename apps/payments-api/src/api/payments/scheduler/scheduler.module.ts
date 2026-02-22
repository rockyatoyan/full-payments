import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { YoukassaModule } from '../provider/youkassa/youkassa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/auth/entities/user.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [YoukassaModule, TypeOrmModule.forFeature([User, Payment])],
  providers: [SchedulerService],
})
export class SchedulerModule {}
