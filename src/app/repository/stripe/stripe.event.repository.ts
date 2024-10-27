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
    id: ObjectId,
    stripeCustomerId: string,
    stripeProductId: string,
    userId: string,
    stripeSubscriptionType: string,
    stripeSubscriptionStatus: string,
    stripeSubscriptionDate: string,
    stripeSubscriptionExpirationDate: string,
    subscriptionPlan: string
  ): Promise<any> {
    const stripeSubscription = await this.stripeEventModel.findOneAndUpdate(
      { _id: id },
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

  async findByStripeEventId(stripeEventId: string) {
    const stripeInfo = await this.stripeEventModel.findOne({ stripe_event_id: stripeEventId })
    return stripeInfo;
  }

}
