import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeDTO } from 'src/app/dto/api/stripe';

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

  async createCharge(stripeDTO: StripeDTO): Promise<Stripe.Charge> {
    const charge = await this.stripe.charges.create(stripeDTO);
    return charge;
  }
}
