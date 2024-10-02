import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type LeadDocument = Lead & Document;
@Schema({
  versionKey: false,
  collection: 'lead',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Lead implements GenericSchema {
  _id: string;

  @Prop({ required: [true, 'Missing required field'] })
  description: string;

  @Prop({ required: [true, 'Missing required field'] })
  category: string;

  @Prop({ required: [true, 'Missing required field'] })
  itemOrder: number;

  @Prop({ required: [true, 'Missing required field'] })
  amount: number;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
