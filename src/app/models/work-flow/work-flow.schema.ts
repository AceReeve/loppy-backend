import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Node, NodeSchema } from './node.schema'; // Ensure correct import
import { WorkFlowStatus } from 'src/app/const/action';

export type WorkFlowDocument = WorkFlow & Document;
export class Trigger {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  trigger_name: string;

  @Prop({ type: [], default: [] })
  content?: any[];
}
export class Action {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  action_name: string;

  @Prop({ required: true })
  content: string;
}

@Schema({
  versionKey: false,
  collection: 'workflow',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WorkFlow {
  @Prop({ required: true })
  work_flow_name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: [Trigger], default: [] })
  trigger: Trigger[];

  @Prop({ type: [Action], default: [] })
  action: Action[];

  @Prop({ default: WorkFlowStatus.SAVED })
  status: string;
}

export const WorkFlowSchema = SchemaFactory.createForClass(WorkFlow);
