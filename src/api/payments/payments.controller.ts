import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { PaymentProvider } from './entities/payment.entity';
import { YookassaWebhook } from 'nestjs-yookassa';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Auth()
  @Post()
  async init(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.init(dto, req.user!);
  }

  @YookassaWebhook()
  @HttpCode(200)
  @Post('webhook/yookassa')
  async handleYookassaWebhook(@Req() req: Request, @Body() body: any) {
    return this.paymentsService.handleWebhook(PaymentProvider.YOOKASSA, body);
  }

  @Get('result')
  async result(@Req() req: Request) {
    return (
      '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">' +
      '<h1>Payment Result</h1>' +
      '<p>Your payment has been processed successfully.</p>' +
      '</div>'
    );
  }
}
