import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type DashboardDocument = Dashboard & Document;
@Schema({
  versionKey: false,
  collection: 'dashboard',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Dashboard implements GenericSchema {
  _id: string;

  @Prop()
  first_name: string;

  @Prop()
  middle_name: string;

  @Prop()
  last_name: string;

  @Prop({ type: Date })
  date: Date;

  @Prop()
  source: string;

  @Prop()
  lead_type: string;

  @Prop()
  call_duration: string;

  @Prop()
  ltv: string;

  @Prop()
  existing_customer: string;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
