import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUpload, FileUploadSchema } from './contacts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUpload.name, schema: FileUploadSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class FileUploadSchemaModule {}
