import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import { WorkFlowStatus } from 'src/app/const/action';

export type TagsDocument = Tags & Document;
@Schema({
  versionKey: false,
  collection: 'tags',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Tags implements GenericSchema {
  _id: string;

  @Prop()
  name: string;
}

export const TagsSchema =
  SchemaFactory.createForClass(Tags);
