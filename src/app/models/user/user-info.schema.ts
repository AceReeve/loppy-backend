import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
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

    @Prop()
    picture?: string;

    @Prop()
    twillio_number?: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
    role?: MongooseSchema.Types.ObjectId;

    @Prop({ default: 'ACTIVE' })
    status: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'StripeEvent' })
    stripe_id?: MongooseSchema.Types.ObjectId;


}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);

