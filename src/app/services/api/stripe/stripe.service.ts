import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  cancelSubscriptionDTO,
  StripePaymentIntentDTO,
  SubscriptionResponseDTO,
  SummarizePaymentDTO,
  UpdateSubscriptionDTO,
} from 'src/app/dto/api/stripe';

import { UserService } from '../../user/user.service';
import { StripeEventRepository } from 'src/app/repository/stripe/stripe.event.repository';
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
    private readonly stripeEventRepository: StripeEventRepository,
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
      let activeFlag = false;
      let incompleteFlag = false;
      let subscriptionId;
      if (Object.keys(this.pricesEnum).includes(stripeSubscriptionDTO.type)) {
        const listOfSubscriptions = await this.stripe.subscriptions.list({
          customer: customerCreated.id,
        });
        if (listOfSubscriptions !== null && (listOfSubscriptions.data !== null && listOfSubscriptions.data.length !== 0)) {
          for (const subscriptionDataList of listOfSubscriptions.data) {
            if (subscriptionDataList.status === "active") {
              for (const subscriptionData of subscriptionDataList.items.data) {
                if (subscriptionData.plan.id === this.pricesEnum[stripeSubscriptionDTO.type] && subscriptionData.plan.active === true) {
                  activeFlag = true;
                }
              }
            } else if (subscriptionDataList.status === "incomplete") {
              incompleteFlag = true;
              subscriptionId = subscriptionDataList.id;
            }
          }
        }

        if (activeFlag) {
          throw new BadRequestException('There is already an active subscription with this plan');
        } else if (incompleteFlag) {
          const retrieveSubscription = await this.stripe.subscriptions.retrieve(
            subscriptionId
          );
          subscription = await this.stripe.subscriptions.update(
            subscriptionId,
            {
              items: [
                {
                  id: retrieveSubscription.items.data[0].id,
                  price: this.pricesEnum[stripeSubscriptionDTO.type]
                }
              ],
              payment_behavior: 'default_incomplete',
              payment_settings: { save_default_payment_method: 'on_subscription' },
              expand: ['latest_invoice.payment_intent'],
            }
          );
        }
        else {
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
    userId: string,
  ): Promise<any> {
    try {
      const user = await this.userService.getUser(userId);
      const stripeEvent = await this.stripeEventRepository.findByUserStripeData(user.userInfo.stripe_id);
      return stripeEvent;
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

  async cancelSubscription(
    cancelSubscriptionDTO: cancelSubscriptionDTO,
    userId: string,
  ): Promise<any> {
    try {

      const subscription = await this.stripe.subscriptions.cancel(
        cancelSubscriptionDTO.subscriptionId
      );

      return subscription;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
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
