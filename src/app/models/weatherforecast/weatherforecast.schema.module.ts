import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WeatherForecast,
  WeatherForecastSchema,
} from './weatherforecast.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherForecast.name, schema: WeatherForecastSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WeatherForecastSchemaModule {}
