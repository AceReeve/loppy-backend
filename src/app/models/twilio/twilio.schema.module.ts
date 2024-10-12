import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { twilio, twilioSchema } from './twilio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: twilio.name, schema: twilioSchema }]),
  ],
  exports: [MongooseModule],
})
export class twilioSchemaModule {}
