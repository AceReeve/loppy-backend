import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  StripePaymentIntentDTO,
  SubscriptionResponseDTO,
  SummarizePaymentDTO,
  UpdateSubscriptionDTO,
} from 'src/app/dto/api/stripe';

import { UserService } from '../../user/user.service';
import { Query } from 'express-serve-static-core'
@Injectable()
export class StripeService {
  private stripe: Stripe

  private pricesEnum = {
    essential: this.configService.get<string>('STARTER_HERO_PRICE_ID'),
    professional: this.configService.get<string>('ADVANCE_HERO_PRICE_ID'),
    corporate: this.configService.get<string>('CORPORATE_HERO_PRICE_ID'),
  };

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email
    });
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

    const customerDetails = await this.stripe.confirmationTokens.retrieve(stripePaymentIntentDTO.confirmationToken);
    const userDetails = await this.userService.getUser(userId);
    let customerCreated;
    if (customerDetails.payment_method_preview.billing_details.name != userDetails.first_name + " " + userDetails.last_name &&
      customerDetails.payment_method_preview.billing_details.email != userDetails.email
    ) {
      throw new BadRequestException("Please verify your name and email combination");
    } else {
      customerCreated = await this.stripe.customers.create({
        name: userDetails.first_name + " " + userDetails.last_name,
        email: userDetails.email,
      });
    }



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


  async createSubscription(
    stripeSubscriptionDTO: StripePaymentIntentDTO,
    userId: string,
  ): Promise<any> {

    const userCreds = await this.userService.getUser(userId);
    let customerCreated;

    const stripeCustomers = await this.stripe.customers.search({
      query: `name:\'${userCreds.userInfo.first_name + " " + userCreds.userInfo.last_name}\' AND email:\'${userCreds.userDetails.email}\'`,
    });

    if (stripeCustomers.data.length >= 1) {
      customerCreated = stripeCustomers.data[0]
    } else {
      customerCreated = await this.stripe.customers.create({
        name: userCreds.userInfo.first_name + " " + userCreds.userInfo.last_name,
        email: userCreds.userDetails.email,
      });
    }

    try {
      let subscription;
      if (Object.keys(this.pricesEnum).includes(stripeSubscriptionDTO.type)) {
        subscription = await this.stripe.subscriptions.create({
          customer: customerCreated.id,
          items: [
            {
              price: this.pricesEnum[stripeSubscriptionDTO.type]
            }
          ],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        })
      }
      const response = new SubscriptionResponseDTO;
      response.subscriptionId = subscription.id;
      response.clientSecret = subscription.latest_invoice.payment_intent.client_secret
      return response;

    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }


  async customerSubscriptions(
    query?: Query,
  ): Promise<any> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: String(query.customerId),
      });

      return subscriptions;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateSubscription(
    updateSubscriptionDTO: UpdateSubscriptionDTO,
    userId: string,
  ): Promise<any> {
    try {

      const retrieveSubscription = await this.stripe.subscriptions.retrieve(
        updateSubscriptionDTO.subscriptionId
      );
      let subscription
      if (Object.keys(this.pricesEnum).includes(updateSubscriptionDTO.type)) {
        subscription = await this.stripe.subscriptions.update(
          updateSubscriptionDTO.subscriptionId,
          {
            items: [
              {
                id: retrieveSubscription.items.data[0].id,
                price: this.pricesEnum[updateSubscriptionDTO.type],
              },
            ],
          }
        );
      }

      return subscription;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log(webhookSecret);
    try {
      const result = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      return result;
    } catch (e) {
      console.log('e', e);
    }

    return null;
  }
}
