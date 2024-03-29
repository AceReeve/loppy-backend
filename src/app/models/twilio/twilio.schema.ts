import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type twilioDocument = twilio & Document;
@Schema({
    versionKey: false,
    collection: 'twiliocredentials',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class twilio implements GenericSchema {
    _id: string;

    @Prop()
    user_id: string;

    @Prop({ unique: true, required: [true, 'Missing required field'] })
    ssid: string;

    @Prop({ unique: true, required: [true, 'Missing required field'] })
    auth_token: string;

    @Prop({ unique: true, required: [true, 'Missing required field'] })
    twilio_number: string;
}

export const twilioSchema = SchemaFactory.createForClass(twilio);
