import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
export type InvitedUserDocument = InvitedUser & Document;

@Schema({
  versionKey: false,
  collection: 'invitedUsers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class InvitedUser implements GenericSchema {
  _id: string;

  @Prop([{ email: String, role: Object, status: String }])
  users: { email: string; role: Object; status: string }[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  invited_by: MongooseSchema.Types.ObjectId;
}
export const InvitedUserSchema = SchemaFactory.createForClass(InvitedUser);
