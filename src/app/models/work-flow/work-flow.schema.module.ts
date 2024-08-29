import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkFlow, WorkFlowSchema } from './work-flow.schema';
import {
  WorkFlowFolder,
  WorkFlowFolderSchema,
} from './work-flow-folder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkFlow.name, schema: WorkFlowSchema },
    ]),
    MongooseModule.forFeature([
      { name: WorkFlowFolder.name, schema: WorkFlowFolderSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WorkFlowSchemaModule {}
