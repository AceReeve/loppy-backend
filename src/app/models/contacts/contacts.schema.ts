import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
export type FileUploadDocument = FileUpload & Document;

@Schema({
  versionKey: false,
  collection: 'contacts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class FileUpload implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object })
  path: any;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
