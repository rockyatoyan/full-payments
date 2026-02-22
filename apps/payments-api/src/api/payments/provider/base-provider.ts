import { Plan } from '@/api/plans/entities/plan.entity';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '../entities/payment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseProvider {
  protected abstract providerName: PaymentProvider;

  abstract initPayment(
    amount: number,
    plan: Plan,
    payment: Payment,
  ): Promise<void>;

  abstract handleWebhook(data: any): Promise<{
    externalPaymentId?: string;
    status: PaymentStatus;
    provider: PaymentProvider;
    metadata: {
      planId: string;
      paymentId: string;
    };
    raw: any;
  }>;

  get name() {
    return this.providerName;
  }
}
