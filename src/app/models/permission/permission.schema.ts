import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type PermissionDocument = Permission & Document;
@Schema({
  versionKey: false,
  collection: 'permissions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Permission implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: [true, 'Missing required field'] })
  action: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ApiModule' })
  module_id: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
