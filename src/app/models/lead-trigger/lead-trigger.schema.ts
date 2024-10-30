import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type LeadTriggerDocument = LeadTrigger & Document;
@Schema({
  versionKey: false,
  collection: 'opportunity_triggers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class LeadTrigger implements GenericSchema {
  _id: string;

  @Prop({ required: [true, 'Missing required field'] })
  trigger_name: string;

  @Prop({ required: [true, 'Missing required field'] })
  trigger_type: string; // opportunity status changed

  @Prop({ required: [true, 'Missing required field'] })
  filter_type: string; // assign to

  @Prop({ required: [true, 'Missing required field'] })
  filter_value: string; // user
}

export const LeadTriggerSchema = SchemaFactory.createForClass(LeadTrigger);
