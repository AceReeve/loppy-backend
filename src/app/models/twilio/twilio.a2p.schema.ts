import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GenericSchema } from "../generic.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TwilioA2PDocument = TwilioA2P & Document;
@Schema({
    versionKey: false,
    collection: 'twilio_a2p',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TwilioA2P implements GenericSchema {
    _id: string;

    @Prop()
    customer_profile_sid?: string;

    @Prop()
    account_sid?: string;

    @Prop()
    end_user_sid?: string;

    @Prop()
    end_user_type?: string;

    @Prop()
    full_name?: string;

    @Prop()
    email?: string;

    @Prop()
    status?: string;

}

export const TwilioA2PSchema = SchemaFactory.createForClass(TwilioA2P);