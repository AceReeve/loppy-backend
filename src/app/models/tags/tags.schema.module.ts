import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tags,
  TagsSchema,
} from './tags.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tags.name, schema: TagsSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TagsSchemaModule {}
