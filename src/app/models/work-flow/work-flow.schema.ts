import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type WorkFlowDocument = WorkFlow & Document;
@Schema({
  versionKey: false,
  collection: 'workflow',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WorkFlow implements GenericSchema {
  _id: string;

  @Prop()
  work_flow_name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;
}

export const WorkFlowSchema = SchemaFactory.createForClass(WorkFlow);
