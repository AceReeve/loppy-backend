import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type StripeEventDocument = StripeEvent & Document;
@Schema({
  versionKey: false,
  collection: 'stripe_event',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class StripeEvent implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop()
  stripe_event_id?: string;

  @Prop()
  stripeSubscriptionType?: string;

  @Prop()
  stripeSubscriptionStatus?: string;

  @Prop()
  subscriptionPlan?: string;

  @Prop()
  stripeSubscriptionDate?: Date;

  @Prop()
  stripeSubscriptionExpirationDate?: Date;


}

export const StripeEventSchema = SchemaFactory.createForClass(StripeEvent);
