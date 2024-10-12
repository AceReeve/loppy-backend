import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../../generic.schema';
export type CustomeRoleDocument = CustomeRole & Document;

@Schema({
  versionKey: false,
  collection: 'customRole',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class CustomeRole implements GenericSchema {
  _id: string;

  @Prop()
  role: string;

  @Prop()
  description: string;

  @Prop()
  team: string;
}
export const CustomeRoleSchema = SchemaFactory.createForClass(CustomeRole);
