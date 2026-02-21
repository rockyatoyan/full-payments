import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { YoukassaService } from '../provider/youkassa/youkassa.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/auth/entities/user.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger('PaymentsSchedulerService');

  constructor(
    private readonly youkassaService: YoukassaService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async renewalSubscription() {
    this.logger.log('Starting subscription renewal process...');

    const users = await this.userRepository.find({
      where: {
        isAllowedAutoRenewal: true,
        subscription: {
          endDate: LessThanOrEqual(new Date()),
        },
      },
    });

    if (users.length === 0) {
      this.logger.log('No users found for subscription renewal.');
      return;
    }

    for (const user of users) {
      const payments = await this.paymentRepository.find({
        where: {
          user: { id: user.id },
          status: PaymentStatus.COMPLETED,
        },
        relations: {
          plan: true,
        },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      const lastPayment = payments[0];

      if (!lastPayment) continue;

      const renewalPayment = await this.paymentRepository.create({
        externalId: lastPayment.externalId,
        provider: lastPayment.provider,
        billingPeriod: lastPayment.billingPeriod,
        status: PaymentStatus.PENDING,
        user,
        plan: lastPayment.plan,
      });

      await this.paymentRepository.save(renewalPayment);

      await this.youkassaService.initFromSavedPayment(
        renewalPayment,
        lastPayment.plan,
      );
    }

    this.logger.log('Subscription renewal process completed.');
  }
}
