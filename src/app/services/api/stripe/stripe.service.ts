import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async charge(
    amount: number,
    currency: string,
    source: string,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    return this.stripe.charges.create({
      amount,
      currency,
      source,
    });
  }
}
