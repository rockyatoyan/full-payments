import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Tailwind,
  Font,
  Heading,
} from '@react-email/components';
import { BilligPeriod, Payment } from '@/api/payments/entities/payment.entity';

interface Props {
  payment: Payment;
}

export const PaymentSuccessTemplate: React.FC<Props> = ({ payment }) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
            format: 'woff2',
          }}
        />
      </Head>
      <Tailwind>
        <Body className="py-5">
          <Heading className="font-sans font-semibold text-center text-gray-800">
            Платеж успешно выполнен!
          </Heading>
          <div className="mt-4 w-full flex flex-col items-center gap-4 bg-gray-100 rounded max-w-md mx-auto p-8">
            <p className="m-0 w-full flex items-center justify-between gap-1">
              <span>Дата:</span>
              <span className="font-medium text-gray-800">
                {new Date(payment.updatedAt).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </p>
            <p className="m-0 w-full flex items-center justify-between gap-1">
              <span>Номер заказа:</span>
              <span className="font-medium text-gray-800">
                {payment.externalId}
              </span>
            </p>
            <p className="m-0 w-full flex items-center justify-between gap-1">
              <span className="font-semibold">Итого:</span>
              <span className="font-medium text-gray-800">
                {payment.billingPeriod === BilligPeriod.MONTHLY
                  ? payment.plan.monthlyPrice
                  : payment.plan.yearlyPrice}{' '}
                ₽
              </span>
            </p>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaymentSuccessTemplate;
