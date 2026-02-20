import { PaymentStatusEnum } from 'nestjs-yookassa';

export interface YoukassaWebhookData {
  event: PaymentStatusEnum;
  object: {
    id: string;
    metadata: {
      planId: string;
      paymentId: string;
    };
  };
}
