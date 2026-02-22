import { IsEnum, IsNotEmpty } from 'class-validator';
import { BilligPeriod, PaymentProvider } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  planId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsEnum(BilligPeriod)
  billingPeriod: BilligPeriod;
}
