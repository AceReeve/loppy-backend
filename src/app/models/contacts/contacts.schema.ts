import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema, ObjectId } from 'mongoose';
import { GenericSchema } from '../generic.schema';
export type ContactsDocument = Contacts & Document;

@Schema()
export class Tags {
  @Prop()
  tag_name: string;
}
@Schema({
  versionKey: false,
  collection: 'contacts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Contacts implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  // @Prop({ type: Object })
  // path: any;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  phone_number: number;

  @Prop()
  source: string;

  @Prop()
  lifetime_value: number;

  @Prop()
  last_campaign_ran: string;

  @Prop()
  last_interaction: Date;

  @Prop({ type: [Tags] })
  tags?: Tags[];
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
