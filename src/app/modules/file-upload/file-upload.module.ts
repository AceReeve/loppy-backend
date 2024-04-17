import { Module } from '@nestjs/common';
import { FileUploadController } from 'src/app/controller/file-upload/file-upload.controller';
import {
  AbstractFileUploadRepository,
  AbstractFileUploadService,
} from 'src/app/interface/file-upload';
import { FileUploadSchemaModule } from 'src/app/models/contacts/contacts.schema.module';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { FileUploadRepository } from 'src/app/repository/file-upload/file-upload.repository';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';
import { S3Service } from 'src/app/services/s3/s3.service';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/app/services/user/user.service';

@Module({
  imports: [FileUploadSchemaModule, UserModule],
  controllers: [FileUploadController],
  providers: [
    {
      provide: AbstractFileUploadRepository,
      useClass: FileUploadRepository,
    },
    {
      provide: AbstractFileUploadService,
      useClass: FileUploadService,
    },
    S3Service,
    UserService,
  ],

  exports: [FileUploadSchemaModule],
})
export class FileUploadModule {}
