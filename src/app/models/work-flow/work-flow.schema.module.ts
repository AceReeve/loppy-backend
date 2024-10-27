import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkFlow, WorkFlowSchema } from './work-flow.schema';
import {
  WorkFlowFolder,
  WorkFlowFolderSchema,
} from './work-flow-folder.schema';
import { Node, NodeSchema } from './node.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkFlow.name, schema: WorkFlowSchema },
      { name: WorkFlowFolder.name, schema: WorkFlowFolderSchema },
      { name: Node.name, schema: NodeSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WorkFlowSchemaModule {}
