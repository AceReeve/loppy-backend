import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeDTO } from 'src/app/dto/api/stripe';
import { StripeEventRepository } from 'src/app/repository/stripe/stripe.event.repository';
import { UserService } from '../../user/user.service';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly repository: StripeEventRepository,
    private userService: UserService
  ) { }

  async addStripeEvent(id: string
  ): Promise<any> {
    return await this.repository.addStripeEvent(id);
  }

  async processSubscriptionUpdate(event: Stripe.Event, userId: string) {
    try {
      await this.addStripeEvent(event.id);
    } catch (error) {
      throw new BadRequestException('This event was already processed');
    }

    const data = event.data.object as Stripe.PaymentIntent;
    const subscriptionStatus = data.status;
    const subscriptionType = "Payment-Intent";
    const subscriptionDate = new Date();
    const subscriptionExpirationDate = new Date();
    subscriptionExpirationDate.setDate(subscriptionExpirationDate.getDate() + 30);

    const prices = {
      essential: 9900,
      professional: 29900,
      corporate: 49900,
    };

    let subscriptionPlan;
    if (data.amount === prices.essential) {
      subscriptionPlan = "Essential"
    } else if (data.amount === prices.professional) {
      subscriptionPlan = "Professional"
    } else if (data.amount === prices.corporate) {
      subscriptionPlan = "Corporate"
    }

    this.repository.createUserStripeSubscriptionData(
      event.id,
      userId,
      subscriptionType,
      subscriptionStatus,
      subscriptionDate,
      subscriptionExpirationDate,
      subscriptionPlan);


    return this.userService.updateUserStripeId(event.id, userId);
  }

}
