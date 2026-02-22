import { User } from '@/api/auth/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BilligPeriod,
  Payment,
  PaymentProvider,
} from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProviderService } from './provider/provider.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    private readonly providerService: ProviderService,
  ) {}

  async init(dto: CreatePaymentDto, user: User) {
    const result = await this.paymentRepository
      .createQueryBuilder()
      .insert()
      .into(Payment)
      .values({
        user: { id: user.id },
        plan: { id: dto.planId },
        provider: dto.provider,
        billingPeriod: dto.billingPeriod,
      })
      .returning('*')
      .execute();

    const payment = await this.paymentRepository.findOne({
      where: { id: result.identifiers[0].id },
      relations: {
        plan: true,
        user: true,
      },
    });

    if (!payment) {
      throw new BadRequestException('Error while creating payment');
    }

    const amount =
      dto.billingPeriod === BilligPeriod.MONTHLY
        ? payment.plan.monthlyPrice
        : payment.plan.yearlyPrice;

    const initResult = await this.providerService.initPayment(
      dto.provider,
      amount,
      payment.plan,
      payment,
    );

    return initResult;
  }

  async handleWebhook(providerName: PaymentProvider, data: any) {
    return this.providerService.handleWebhook(providerName, data);
  }
}
