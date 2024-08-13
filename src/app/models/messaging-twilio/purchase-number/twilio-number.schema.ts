import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../generic.schema';

export type TwilioNumberDocument = TwilioNumber & Document;
@Schema({
  versionKey: false,
  collection: 'twiliopurchasednumber',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TwilioNumber implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  purchase_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TwilioOrganizations' })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop()
  purchased_number: string;

  @Prop()
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TwilioInboxes' })
  inbox_assinged_To?: MongooseSchema.Types.ObjectId;
}

export const TwilioNumberSchema = SchemaFactory.createForClass(TwilioNumber);
