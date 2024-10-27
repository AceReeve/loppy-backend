import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../../generic.schema';

export type ActivatedTwilioOrganizationsDocument =
  ActivatedTwilioOrganizations & Document;
@Schema({
  versionKey: false,
  collection: 'activatedtwilioorganizations',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ActivatedTwilioOrganizations implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TwilioOrganizations' })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  activated_by: MongooseSchema.Types.ObjectId;

  @Prop()
  status: string;
}

export const ActivatedTwilioOrganizationsSchema = SchemaFactory.createForClass(
  ActivatedTwilioOrganizations,
);
