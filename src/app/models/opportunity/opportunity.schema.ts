import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { Lead } from '../lead/lead.schema';

export type OpportunityDocument = Opportunity & Document;
@Schema({
  versionKey: false,
  collection: 'opportunity',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Opportunity implements GenericSchema {
  _id: string;

  @Prop({ required: [true, 'Missing required field'] })
  title: string;

  @Prop({ type: String, default: '#0000FF' })
  color: string;

  @Prop({ required: [true, 'Missing required field'] })
  lead_value: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Lead' }] })
  leads: Lead[];
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
