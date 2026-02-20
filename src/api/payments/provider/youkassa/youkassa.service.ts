import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseProvider } from '../base-provider';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '../../entities/payment.entity';
import {
  ConfirmationEnum,
  CurrencyEnum,
  type CreatePaymentRequest,
  YookassaService as NestjsYookassaService,
  PaymentStatusEnum,
} from 'nestjs-yookassa';
import { Plan } from '@/api/plans/entities/plan.entity';
import { YoukassaWebhookData } from './interfaces/webhook.interface';

@Injectable()
export class YoukassaService extends BaseProvider {
  protected providerName = PaymentProvider.YOOKASSA;

  constructor(
    private readonly configService: ConfigService,
    private readonly youkassaService: NestjsYookassaService,
  ) {
    super();
  }

  async initPayment(
    amount: number,
    plan: Plan,
    payment: Payment,
  ): Promise<any> {
    try {
      const paymentData: CreatePaymentRequest = {
        amount: {
          value: amount,
          currency: CurrencyEnum.RUB,
        },
        description: `Payment for plan "${plan.title}"`,
        capture: false,
        confirmation: {
          type: ConfirmationEnum.REDIRECT,
          return_url: this.configService.getOrThrow('YOOKASSA_RETURN_URL'),
        },
        metadata: {
          planId: plan.id,
          paymentId: payment.id,
        },
      };

      const newPayment =
        await this.youkassaService.payments.create(paymentData);

      return {
        //@ts-ignore
        url: newPayment?.confirmation?.confirmation_url,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Youkassa payment initialization failed: ${error.message}`,
      );
    }
  }

  async handleWebhook(data: YoukassaWebhookData) {
    const externalPaymentId = data?.object?.id;
    const metadata = data?.object?.metadata;

    switch (data.event.split('.').pop()) {
      case PaymentStatusEnum.SUCCEEDED:
        return {
          status: PaymentStatus.COMPLETED,
          externalPaymentId,
          provider: this.providerName,
          metadata,
          raw: data,
        };
      case PaymentStatusEnum.PENDING:
        return {
          status: PaymentStatus.PENDING,
          externalPaymentId,
          provider: this.providerName,
          metadata,
          raw: data,
        };
      case PaymentStatusEnum.WAITING_FOR_CAPTURE:
        const capturedPayment =
          await this.youkassaService.payments.capture(externalPaymentId);
        return {
          status: PaymentStatus.PENDING,
          externalPaymentId: capturedPayment.id,
          provider: this.providerName,
          metadata,
          raw: data,
        };
      case PaymentStatusEnum.CANCELED:
        return {
          status: PaymentStatus.FAILED,
          externalPaymentId,
          provider: this.providerName,
          metadata,
          raw: data,
        };
      default:
        throw new InternalServerErrorException(
          `Unhandled Youkassa status: ${data.event}`,
        );
    }
  }
}
