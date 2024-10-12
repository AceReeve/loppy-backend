import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GenericSchema } from '../generic.schema';

export type WeatherForecastDocument = WeatherForecast & Document;
@Schema({
  versionKey: false,
  collection: 'weatherforecast',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class WeatherForecast implements GenericSchema {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop()
  temperature?: string;

  @Prop()
  notificationType?: string;

  @Prop()
  updatedLocation?: string;
}

export const WeatherForecastSchema =
  SchemaFactory.createForClass(WeatherForecast);
