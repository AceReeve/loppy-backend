import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../../generic.schema';
export type InvitedMemberDocument = InvitedMember & Document;

export class Email {
  @Prop()
  email: string;

  @Prop({ type: Object })
  role: any;

  @Prop({ type: Object })
  team: any;

  @Prop()
  status: string;
}
@Schema({
  versionKey: false,
  collection: 'invitedMembers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class InvitedMember implements GenericSchema {
  _id: string;

  @Prop()
  emails: Email[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  invited_by: MongooseSchema.Types.ObjectId;
}
export const InvitedMemberSchema = SchemaFactory.createForClass(InvitedMember);
