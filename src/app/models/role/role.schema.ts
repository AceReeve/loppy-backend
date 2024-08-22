import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type RoleDocument = Role & Document;
@Schema({
  versionKey: false,
  collection: 'role',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Role implements GenericSchema {
  _id: string;

  @Prop({ unique: true, required: [true, 'Missing required field'] })
  role_name: string;

  @Prop()
  description?: string;

  
  @Prop({ default: 'ACTIVE' })
  role_status: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
