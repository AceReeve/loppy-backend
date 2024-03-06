import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

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

  async createCharge(): Promise<Stripe.Charge> {
    const testToken = 'tok_visa';
    const charge = await this.stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: testToken,
      description: 'Test charge using a Stripe test token',
    });

    return charge;
  }
}
