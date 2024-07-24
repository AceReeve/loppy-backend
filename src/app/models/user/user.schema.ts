import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User implements GenericSchema {
  _id: string;

  @Prop({
    unique: true,
    required: [true, 'Missing required email field'],
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  verified_email?: boolean;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  login_by?: string;

  @Prop()
  login_count: number;

  @Prop()
  already_send_invites?: boolean;

  @Prop()
  reset_password_token?: string;

  @Prop()
  role: string;
}

async function hashPasswordHook(next: () => void): Promise<void> {
  const _ = this as UserDocument;
  if (!_.isModified('password')) return next();
  const password = await bcrypt.hash(_.password, 12);
  _.set('password', password);
  next();
}

async function findExistingEmailHook(value: string): Promise<boolean> {
  const _ = this as UserDocument;

  if (!_.isNew && !_.isModified('email')) return true;
  const user = <Model<UserDocument>>_.constructor;
  try {
    const count = await user.countDocuments({ email: value });
    if (count > 0) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', hashPasswordHook);
UserSchema.path('email').validate(
  findExistingEmailHook,
  'Email already exists',
);
