import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type twilioDocument = twilio & Document;
@Schema({
  versionKey: false,
  collection: 'twiliocredentials',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class twilio implements GenericSchema {
  _id: string;

  @Prop()
  user_id: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_account_sid: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_chat_service_sid: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_api_key_sid: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_api_key_secret: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_auth_token: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  twilio_number: string;
}

export const twilioSchema = SchemaFactory.createForClass(twilio);
