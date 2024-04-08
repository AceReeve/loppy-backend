import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeEvent, StripeEventSchema } from './stripe.event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StripeEvent.name, schema: StripeEventSchema }]),
  ],
  exports: [MongooseModule],
})
export class StripeEventSchemaModule {}
