import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkFlow, WorkFlowSchema } from './work-flow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkFlow.name, schema: WorkFlowSchema }]),
  ],
  exports: [MongooseModule],
})
export class WorkFlowSchemaModule {}
