import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Dashboard } from 'src/app/models/dashboard/dashboard.schema';

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
    userId: string,
    stripeSubscriptionType: string,
    stripeSubscriptionStatus: string,
    stripeSubscriptionDate: Date,
    stripeSubscriptionExpirationDate: Date,
    subscriptionPlan: string
  ): Promise<any> {
    const stripeSubscription = await this.stripeEventModel.findOneAndUpdate(
      { stripe_event_id: stripeEventId },
      {
        $set:
        {
          user_id: userId,
          stripeSubscriptionType: stripeSubscriptionType,
          stripeSubscriptionStatus: stripeSubscriptionStatus,
          stripeSubscriptionDate: stripeSubscriptionDate,
          stripeSubscriptionExpirationDate: stripeSubscriptionExpirationDate,
          subscriptionPlan: subscriptionPlan
        }
      })
    return stripeSubscription
  }



}
