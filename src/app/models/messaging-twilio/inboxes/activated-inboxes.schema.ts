import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../generic.schema';

export type ActivatedTwilioInboxesDocument = ActivatedTwilioInboxes & Document;
@Schema({
  versionKey: false,
  collection: 'activatedtwilioinbox',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ActivatedTwilioInboxes implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TwilioInboxes' })
  inbox_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  activated_by: MongooseSchema.Types.ObjectId;

  @Prop()
  status: string;
}

export const ActivatedTwilioInboxesSchema = SchemaFactory.createForClass(
  ActivatedTwilioInboxes,
);
