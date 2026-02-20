import { Plan } from '@/api/plans/entities/plan.entity';
import {
  BilligPeriod,
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '../entities/payment.entity';
import { YoukassaService } from './youkassa/youkassa.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '@/api/subsriptions/entities/subscription.entity';

@Injectable()
export class ProviderService {
  constructor(
    private readonly youkassaService: YoukassaService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async initPayment(
    providerName: PaymentProvider,
    amount: number,
    plan: Plan,
    payment: Payment,
  ) {
    const provider = this.getProviderInstance(providerName);

    return provider.initPayment(amount, plan, payment);
  }

  async handleWebhook(providerName: PaymentProvider, data: any) {
    const provider = this.getProviderInstance(providerName);

    const result = await provider.handleWebhook(data);

    if (result.status === PaymentStatus.COMPLETED) {
      await this.completePayment({
        paymentId: result.metadata.paymentId,
        planId: result.metadata.planId,
        externalPaymentId: result.externalPaymentId,
        provider: result.provider,
        raw: result.raw,
      });
      return true;
    }

    if (result.status === PaymentStatus.FAILED) {
      await this.failPayment({
        paymentId: result.metadata.paymentId,
        planId: result.metadata.planId,
        externalPaymentId: result.externalPaymentId,
        provider: result.provider,
        raw: result.raw,
      });
    }

    if (result.status === PaymentStatus.PENDING) {
      return true;
    }

    throw new BadRequestException('Unknown payment status');
  }

  private async completePayment(dto: {
    paymentId: string;
    planId: string;
    externalPaymentId: string;
    provider: PaymentProvider;
    raw: any;
  }) {
    const { paymentId, planId, externalPaymentId, provider, raw } = dto;

    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: {
        user: {
          subscription: {
            plan: true,
          },
        },
        plan: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.externalId = externalPaymentId;
    payment.provider = provider;
    payment.metadata = raw;

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (payment.billingPeriod === BilligPeriod.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    if (!payment.user?.subscription) {
      const subscription = this.subscriptionRepository.create({
        startDate,
        endDate,
        plan: payment.plan,
        user: payment.user,
      });
      await this.subscriptionRepository.save(subscription);
    } else {
      const subscription = payment.user.subscription;
      if (subscription.plan.id !== planId) {
        subscription.plan = payment.plan;
      }
      if (subscription.endDate < new Date()) {
        subscription.startDate = startDate;
        subscription.endDate = endDate;
      } else {
        const currentEndDate = subscription.endDate;
        const newEndDate = new Date(currentEndDate);
        if (payment.billingPeriod === BilligPeriod.MONTHLY) {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        } else {
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        }
        subscription.endDate = endDate;
      }
      await this.subscriptionRepository.save(subscription);
    }

    const savedPayment = await this.paymentRepository.save(payment);

    return savedPayment;
  }

  private async failPayment(dto: {
    paymentId: string;
    planId: string;
    externalPaymentId: string;
    provider: PaymentProvider;
    raw: any;
  }) {
    const payment = await this.paymentRepository.findOne({
      where: { id: dto.paymentId },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    payment.status = PaymentStatus.FAILED;
    payment.externalId = dto.externalPaymentId;
    payment.provider = dto.provider;
    payment.metadata = dto.raw;

    const savedPayment = await this.paymentRepository.save(payment);

    return savedPayment;
  }

  private getProviderInstance(providerName: PaymentProvider) {
    switch (providerName) {
      case PaymentProvider.YOOKASSA:
        return this.youkassaService;
      default:
        throw new BadRequestException('Provider not found');
    }
  }
}
