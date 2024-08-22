import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type ApiModuleDocument = ApiModule & Document;
@Schema({
  versionKey: false,
  collection: 'apimodules',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ApiModule implements GenericSchema {
  _id: string;

  @Prop({ required: [true, 'Missing required field'] })
  module: string;
}

export const ApiModuleSchema = SchemaFactory.createForClass(ApiModule);
