import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseProvider } from '../base-provider';
import {
  BilligPeriod,
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
  VatCodesEnum,
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
        receipt: {
          customer: {
            email: payment.user.email,
            full_name: payment.user.name,
          },
          items: [
            {
              description: `Subscription to plan "${plan.title}"`,
              quantity: 1,
              amount: {
                value: amount,
                currency: CurrencyEnum.RUB,
              },
              vat_code: VatCodesEnum.NDS_NONE,
            },
          ],
        },
        save_payment_method: true,
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

  async initFromSavedPayment(payment: Payment, plan: Plan) {
    try {
      const amount =
        payment.billingPeriod === BilligPeriod.MONTHLY
          ? plan.monthlyPrice
          : plan.yearlyPrice;

      const paymentData: CreatePaymentRequest = {
        amount: {
          value: amount,
          currency: CurrencyEnum.RUB,
        },
        description: `Payment for plan "${plan.title}"`,
        capture: true,
        receipt: {
          customer: {
            email: payment.user.email,
            full_name: payment.user.name,
          },
          items: [
            {
              description: `Subscription to plan "${plan.title}"`,
              quantity: 1,
              amount: {
                value: amount,
                currency: CurrencyEnum.RUB,
              },
              vat_code: VatCodesEnum.NDS_NONE,
            },
          ],
        },
        payment_method_id: payment.externalId,
        save_payment_method: true,
        metadata: {
          planId: plan.id,
          paymentId: payment.id,
        },
      };

      const newPayment =
        await this.youkassaService.payments.create(paymentData);

      return newPayment;
    } catch (error) {
      throw new InternalServerErrorException(
        `Youkassa payment renewal failed: ${error.message}`,
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
