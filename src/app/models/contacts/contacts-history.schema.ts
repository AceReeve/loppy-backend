import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type ContactsHistoryDocument = ContactsHistory & Document;

@Schema()
export class History {
  @Prop({ type: Date })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Contact' })
  contact_id: MongooseSchema.Types.ObjectId;
}

@Schema({
  versionKey: false,
  collection: 'contactsHistory',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ContactsHistory implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop()
  type: string;

  @Prop({ type: [History], default: [] })
  history: History[];
}

export const ContactsHistorySchema =
  SchemaFactory.createForClass(ContactsHistory);
