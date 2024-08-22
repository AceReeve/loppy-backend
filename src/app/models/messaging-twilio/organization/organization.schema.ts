import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../generic.schema';

export type TwilioOrganizationsDocument = TwilioOrganizations & Document;
@Schema({
  versionKey: false,
  collection: 'twilioorganizations',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TwilioOrganizations implements GenericSchema {
  _id: string;

  @Prop()
  organization_name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

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

  @Prop()
  status: string;
}

export const TwilioOrganizationsSchema =
  SchemaFactory.createForClass(TwilioOrganizations);
