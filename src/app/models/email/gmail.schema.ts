import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type CustomerRepliedDocument = CustomerReplied & Document;
@Schema({
  versionKey: false,
  collection: 'customerreplied',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class CustomerReplied implements GenericSchema {
  _id: string;
  
  @Prop()
  email: string;

  @Prop()
  emailId: string;

  @Prop()
  threadId: string;

  @Prop()
  topicIdentifier: string;

  @Prop()
  subject: string;

  @Prop()
  body: string;

}

export const CustomerRepliedSchema = SchemaFactory.createForClass(CustomerReplied);
