import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeDTO } from 'src/app/dto/api/stripe';
import { StripeEventRepository } from 'src/app/repository/stripe/stripe.event.repository';
import { UserService } from '../../user/user.service';
import { Public } from 'src/app/decorators/public.decorator';
import { UserRepository } from 'src/app/repository/user/user.repository';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe

  private pricesEnum = {
    essential: this.configService.get<string>('STARTER_HERO_PRICE_ID'),
    professional: this.configService.get<string>('ADVANCE_HERO_PRICE_ID'),
    corporate: this.configService.get<string>('CORPORATE_HERO_PRICE_ID'),
  };
  constructor(
    private readonly repository: StripeEventRepository,
    private userService: UserService,
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async addStripeEvent(id: string
  ): Promise<any> {
    try {
      return await this.repository.addStripeEvent(id);
    } catch (error) {
      throw new BadRequestException('This event was already processed');
    }
  }

  async processSubscriptionUpdate(event: Stripe.Event) {

    let data
    let eventType = event.type;
    let session
    let userId

    switch (eventType) {
      case 'checkout.session.completed': {
        await this.addStripeEvent(event.id);
        data = event.data as Stripe.CheckoutSessionCompletedEvent;
        session = await this.stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ['line_items']
          }
        );

        const customerId = session?.customer as string;
        const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;

        const priceId = session?.line_items.data[0]?.price.id;

        const user = await this.userService.getUserByEmail(customer.email);
        if (user) {
          let subscriptionPlan;
          userId = user.userDetails._id;

          if (Object.values(this.pricesEnum).includes(priceId)) {
            subscriptionPlan = priceId;
          }
          this.repository.createUserStripeSubscriptionData(
            event.id,
            customerId,
            priceId,
            userId,
            'Subscription',
            session.status,
            session.created,
            session.expires_at,
            subscriptionPlan);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        await this.addStripeEvent(event.id);
        data = event.data as Stripe.CustomerSubscriptionDeletedEvent;
        session = await this.stripe.subscriptions.retrieve(
          data.object.id
        );

        const customerId = session?.customer as string;
        const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;

        const priceId = session.items.data[0].plan.id;

        const user = await this.userService.getUserByEmail(customer.email);
        if (user) {
          let subscriptionPlan;
          userId = user.userDetails._id;
          if (Object.values(this.pricesEnum).includes(priceId)) {
            subscriptionPlan = priceId;
          }
          this.repository.createUserStripeSubscriptionData(
            event.id,
            customerId,
            priceId,
            userId,
            'Subscription-Canceled',
            session.status,
            session.created,
            session.expires_at,
            subscriptionPlan);
        }
        break;
      }
      case 'checkout.session.expired': {
        await this.addStripeEvent(event.id);
        data = event.data as Stripe.CheckoutSessionExpiredEvent;
        session = await this.stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ['line_items']
          }
        );

        const customerId = session?.customer as string;
        const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;

        const priceId = session?.line_items.data[0]?.price.id;

        const user = await this.userService.getUserByEmail(customer.email);
        if (user) {
          let subscriptionPlan;
          userId = user.userDetails._id;
          if (Object.values(this.pricesEnum).includes(priceId)) {
            subscriptionPlan = priceId;
          }
          this.repository.createUserStripeSubscriptionData(
            event.id,
            customerId,
            priceId,
            userId,
            'Subscription-Expired',
            session.status,
            session.created,
            session.expires_at,
            subscriptionPlan);
        }
        break;
      }
    }

    return await this.userService.updateUserStripeId(event.id, userId);
  }


  async getUserStripeData(id: string
  ): Promise<any> {

    const userInfo = await this.userService.findByUserId(id);
    return await this.repository.findByUserStripeData(userInfo.stripe_id);
  }

}
