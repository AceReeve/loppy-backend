import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeDTO, StripePaymentIntentDTO, SummarizePaymentDTO } from 'src/app/dto/api/stripe';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';
import { Public } from 'src/app/decorators/public.decorator';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private userInfo: UserInfo;

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

  async createPaymentIntent(
    stripePaymentIntentDTO: StripePaymentIntentDTO,
    userId: string,
  ): Promise<{ client_secret: string; status: Stripe.PaymentIntent }> {
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
          confirmation_token: stripePaymentIntentDTO.confirmationToken,
          currency: 'usd',
          return_url: 'https://example.com/order/123/complete',
          use_stripe_sdk: true,
          metadata: { userId: userId.toString() },
        });
        console.log("asdasdassda", paymentIntent)
        if (paymentIntent.status)
          return {
            client_secret: paymentIntent.client_secret,
            status: paymentIntent,
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


  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log(webhookSecret)
    try {
      const result = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      return result;
    } catch (e) {
      console.log("e", e)
    }

    return null;
  }

}
