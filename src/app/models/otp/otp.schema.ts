import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type OtpDocument = Otp & Document;
@Schema({
  versionKey: false,
  collection: 'otp',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Otp implements GenericSchema {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop()
  expiresAt: Date;

  @Prop({ default: false })
  verified_email: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
