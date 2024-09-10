import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../../generic.schema';
export type TeamDocument = Team & Document;

@Schema({
  versionKey: false,
  collection: 'teams',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Team implements GenericSchema {
  _id: string;

  @Prop()
  team: string;

  @Prop()
  description: string;

  @Prop()
  team_members: Object[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
