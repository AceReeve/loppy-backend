import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type FileUploadDocument = FileUpload & Document;

@Schema({
  versionKey: false,
  collection: 'fileuploads',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class FileUpload implements GenericSchema {
  _id: string;

  @Prop({ required: true })
  original_filename: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ default: 'TEMP' })
  status: string;

  @Prop({ default: '' })
  path: string;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
