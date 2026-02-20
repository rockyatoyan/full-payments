import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { YoukassaModule } from './youkassa/youkassa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Subscription } from '@/api/subsriptions/entities/subscription.entity';

@Module({
  imports: [YoukassaModule, TypeOrmModule.forFeature([Payment, Subscription])],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
