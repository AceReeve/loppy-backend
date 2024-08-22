import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type DBEnvVarDocument = DBEnvVar & Document;

@Schema({
  versionKey: false,
  collection: 'dbenv',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toObject: { getters: true },
  toJSON: { getters: true },
  id: false, // virtual property getter return by mongoose
})
export class DBEnvVar implements GenericSchema {
  _id: string;

  @Prop({
    required: [true, 'Missing required variable_name field'],
    unique: true,
  })
  variable_name: string;

  @Prop({ required: [true, 'Missing required value field'] })
  value: string;

  @Prop({ required: [true, 'Missing required data_type field'] })
  data_type: string;

  @Prop({})
  custom_regex_validator: string;

  @Prop({ required: [true, 'Missing required label field'] })
  label: string;

  @Prop({ required: [true, 'Missing required description field'] })
  description: string;
}

export const DBEnvVarSchema = SchemaFactory.createForClass(DBEnvVar);
