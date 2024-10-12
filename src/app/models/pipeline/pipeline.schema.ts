import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { Opportunity } from '../opportunity/opportunity.schema';

export type PipelineDocument = Pipeline & Document;
@Schema({
  versionKey: false,
  collection: 'pipeline',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Pipeline implements GenericSchema {
  _id: string;

  @Prop({ required: [true, 'Missing required field'] })
  title: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Opportunity' }] })
  opportunities: Opportunity[];
}

export const PipelineSchema = SchemaFactory.createForClass(Pipeline);
