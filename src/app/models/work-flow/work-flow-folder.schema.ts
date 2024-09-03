import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { WorkFlowFolderStatus } from 'src/app/const/action';

export type WorkFlowFolderDocument = WorkFlowFolder & Document;
@Schema({
  versionKey: false,
  collection: 'workflowfolder',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WorkFlowFolder implements GenericSchema {
  _id: string;

  @Prop()
  folder_name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ default: WorkFlowFolderStatus.ACTIVE })
  status: string;
}

export const WorkFlowFolderSchema =
  SchemaFactory.createForClass(WorkFlowFolder);
