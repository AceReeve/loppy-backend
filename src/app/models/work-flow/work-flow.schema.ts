import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Schema as MongooseSchema } from 'mongoose';
import { Node, NodeSchema } from './node.schema'; // Ensure correct import
import { WorkFlowStatus } from 'src/app/const/action';

export type WorkFlowDocument = WorkFlow & Document;
export class Trigger {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  node_name: string;

  @Prop()
  node_type_id?: string;

  @Prop({ type: Object, default: {} })
  content?: any;
}
export class Action {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  node_name: string;

  @Prop()
  node_type_id?: string;

  @Prop({ type: Object, default: {} })
  content?: any;
}

@Schema({
  versionKey: false,
  collection: 'workflow',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WorkFlow {
  @Prop({ required: true })
  name: string;

  @Prop()
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WorkFlowFolder' })
  folder_id?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [Trigger], default: [] })
  trigger: Trigger[];

  @Prop({ type: [Action], default: [] })
  action: Action[];

  @Prop({ default: WorkFlowStatus.SAVED })
  status: string;

  @Prop({ type: Date })
  created_at?: Date;

  @Prop({ type: Date })
  updated_at?: Date;

  @Prop({ default: false })
  isPublished: boolean;
}
export const WorkFlowSchema = SchemaFactory.createForClass(WorkFlow);
