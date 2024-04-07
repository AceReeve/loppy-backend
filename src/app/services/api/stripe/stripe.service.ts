import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  StripeDTO,
  StripePaymentIntentDTO,
  SummarizePaymentDTO,
} from 'src/app/dto/api/stripe';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCharge(stripeDTO: StripeDTO): Promise<Stripe.Charge> {
    const charge = await this.stripe.charges.create(stripeDTO);
    return charge;
  }

  async createPaymentIntent(
    stripePaymentIntentDTO: StripePaymentIntentDTO,
  ): Promise<{ client_secret: string; status: Stripe.PaymentIntent.Status }> {
    const prices = {
      essential: 99,
      professional: 299,
      corporate: 499,
    };

    if (Object.keys(prices).includes(stripePaymentIntentDTO.type)) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          confirm: true,
          amount: prices[stripePaymentIntentDTO.type] * 100, // 100 cent = 1 usd
          currency: 'usd',
          confirmation_token: stripePaymentIntentDTO.confirmationToken,
          return_url: 'https://example.com/order/123/complete',
          use_stripe_sdk: true,
        });

        if (paymentIntent.status)
          return {
            client_secret: paymentIntent.client_secret,
            status: paymentIntent.status,
          };
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }
    throw new BadRequestException('Payment type is invalid.');
  }

  async summarizePayment(
    summarizePaymentDTO: SummarizePaymentDTO,
  ): Promise<Stripe.ConfirmationToken> {
    try {
      const token = summarizePaymentDTO.confirmationToken;
      if (token) {
        return await this.stripe.confirmationTokens.retrieve(token);
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
