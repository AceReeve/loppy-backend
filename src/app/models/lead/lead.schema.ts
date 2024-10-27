import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { LeadStatus } from 'src/app/const';

export type LeadDocument = Lead & Document;
@Schema({
  versionKey: false,
  collection: 'opportunities',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Lead implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: [false, 'Missing required field'] })
  stage_id: string;

  @Prop({ required: [false, 'Missing required field'] })
  pipeline_id: string;

  @Prop({ required: [false, 'Missing required field'] })
  primary_contact_name_id: string;

  @Prop({ required: [false, 'Missing required field'] })
  opportunity_name: string;

  @Prop({ required: [false, 'Missing required field'] })
  opportunity_source: string;

  @Prop({ required: [false, 'Missing required field'] })
  status: LeadStatus;

  @Prop({ required: [false, 'Missing required field'] })
  opportunity_value: number;

  @Prop({ required: [false, 'Missing required field'] })
  primary_email: string;

  @Prop({ required: [false, 'Missing required field'] })
  primary_phone: string;

  @Prop({ required: [false, 'Missing required field'] })
  additional_contacts: string;

  @Prop({ required: [false, 'Missing required field'] })
  followers: string;

  @Prop({ required: [false, 'Missing required field'] })
  business_name: string;

  @Prop({ required: [false, 'Missing required field'] })
  tags: string[];
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
