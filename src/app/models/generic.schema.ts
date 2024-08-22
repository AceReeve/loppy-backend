import { Prop } from '@nestjs/mongoose';

export class GenericSchema<T = string> {
  @Prop({ auto: true, required: true })
  _id: T | string;
}
