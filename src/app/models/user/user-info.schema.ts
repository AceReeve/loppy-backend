import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import * as bcrypt from 'bcrypt';
export type UserInfoDocument = UserInfo & Document;

@Schema({
    versionKey: false,
    collection: 'userinfo',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class UserInfo implements GenericSchema {
    _id: string;

    @Prop()
    username: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user_id: MongooseSchema.Types.ObjectId;

    @Prop()
    first_name: string;

    @Prop()
    middle_name: string;

    @Prop()
    last_name: string;

    @Prop()
    address: string;

    @Prop()
    zipCode: number;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    contact_no: number;

    @Prop()
    gender: string;

    @Prop({ type: Date, })
    birthday: Date;

    @Prop()
    title: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);

