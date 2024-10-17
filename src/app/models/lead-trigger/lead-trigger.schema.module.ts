import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadTrigger, LeadTriggerSchema } from './lead-trigger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeadTrigger.name, schema: LeadTriggerSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class LeadTriggerSchemaModule {}
