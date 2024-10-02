import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Opportunity, OpportunitySchema } from './opportunity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Opportunity.name, schema: OpportunitySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class OpportunitySchemaModule {}
