import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
export type InvitedUserDocument = InvitedUser & Document;

export class Email {
    @Prop()
    email: string;

    @Prop()
    status: string;
}
@Schema({
    versionKey: false,
    collection: 'invitedUsers',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class InvitedUser implements GenericSchema {
    _id: string;

    @Prop()
    emails: Email[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    invited_by: MongooseSchema.Types.ObjectId;
}
export const InvitedUserSchema = SchemaFactory.createForClass(InvitedUser);

