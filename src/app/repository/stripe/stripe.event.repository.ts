import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, ObjectId, Types, UpdateQuery } from 'mongoose';

import * as _ from 'lodash';
import { StripeEvent } from 'src/app/models/stripe/stripe.event.schema';
@Injectable()
export class StripeEventRepository {
  constructor(
    @InjectModel(StripeEvent.name) private stripeEventModel: Model<StripeEvent & Document>,
  ) { }

  async addStripeEvent(id: string
  ): Promise<any> {
    const stripeEvent = await this.stripeEventModel.create({ stripe_event_id: id })
    return stripeEvent
  }

  async createUserStripeSubscriptionData(
    stripeEventId: string,
    stripeCustomerId: string,
    stripeProductId: string,
    userId: string,
    stripeSubscriptionType: string,
    stripeSubscriptionStatus: string,
    stripeSubscriptionDate: Number,
    stripeSubscriptionExpirationDate: Number,
    subscriptionPlan: string
  ): Promise<any> {
    const stripeSubscription = await this.stripeEventModel.findOneAndUpdate(
      { stripe_event_id: stripeEventId },
      {
        $set:
        {
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          stripe_product_id: stripeProductId,
          stripeSubscriptionType: stripeSubscriptionType,
          stripeSubscriptionStatus: stripeSubscriptionStatus,
          stripeSubscriptionDate: stripeSubscriptionDate,
          stripeSubscriptionExpirationDate: stripeSubscriptionExpirationDate,
          subscriptionPlan: subscriptionPlan
        }
      })
    return stripeSubscription
  }

  async findByUserStripeData(stripeId: ObjectId) {
    const stripeInfo = await this.stripeEventModel.findOne({ _id: stripeId })
    return stripeInfo;
  }

}
