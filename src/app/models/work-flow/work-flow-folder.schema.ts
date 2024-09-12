import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { WorkFlowStatus } from 'src/app/const/action';

export type WorkFlowFolderDocument = WorkFlowFolder & Document;
@Schema({
  versionKey: false,
  collection: 'workflowfolder',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WorkFlowFolder implements GenericSchema {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ default: WorkFlowStatus.ACTIVE })
  status: string;

  @Prop({ type: Date })
  created_at?: Date;

  @Prop({ type: Date })
  updated_at?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WorkFlowFolder' })
  folder_id?: MongooseSchema.Types.ObjectId;
}

export const WorkFlowFolderSchema =
  SchemaFactory.createForClass(WorkFlowFolder);
