import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pipeline, PipelineSchema } from './pipeline.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pipeline.name, schema: PipelineSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class PipelineSchemaModule {}
