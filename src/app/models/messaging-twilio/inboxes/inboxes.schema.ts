import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../generic.schema';

export type TwilioInboxesDocument = TwilioInboxes & Document;
@Schema({
  versionKey: false,
  collection: 'twilioinboxes',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TwilioInboxes implements GenericSchema {
  _id: string;

  @Prop()
  inbox_name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TwilioOrganizations' })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop()
  purchased_number: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop()
  identity?: string;

  @Prop()
  status: string;

  @Prop([{ user_id: Object }])
  members?: { user_id: string }[];
}

export const TwilioInboxesSchema = SchemaFactory.createForClass(TwilioInboxes);
