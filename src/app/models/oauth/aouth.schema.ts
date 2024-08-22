import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type OauthDocument = Oauth & Document;
@Schema({
    versionKey: false,
    collection: 'oauth',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Oauth implements GenericSchema {
    _id: string;

    @Prop()
    email: string;

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop({ default: 'ACTIVE' })
    status: string;

    @Prop()
    picture?: string;

    @Prop()
    login_by: string;

    @Prop()
    login_count: number;
}
export const OauthSchema = SchemaFactory.createForClass(Oauth);
