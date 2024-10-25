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
    account_sid?: string;

    @Prop()
    secondary_customer_profile_sid?: string;

    @Prop()
    end_user_customer_profile_sid?: string;

    @Prop()
    end_user_authorized_representative_sid?: string;

    @Prop()
    supporting_document_sid?: string;

    @Prop()
    secondary_customer_profile_status?: string;

    @Prop()
    trust_product_sid?: string;

    @Prop()
    trust_product_end_user_sid?: string;

    @Prop()
    trust_product_status?: string;

    @Prop()
    messaging_service_sid?: string;

    @Prop()
    brand_sid?: string;

    @Prop()
    campaign_sid?: string;

    @Prop()
    full_name?: string;

    @Prop()
    email?: string;

    @Prop()
    twilioPhoneNumber?: string;

    @Prop()
    overall_status?: string;


}

export const TwilioA2PSchema = SchemaFactory.createForClass(TwilioA2P);