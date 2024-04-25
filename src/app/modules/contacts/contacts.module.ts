import { Module } from '@nestjs/common';
import { ContactsController } from 'src/app/controller/contacs/contacs.controller';
import {
  AbstractContactsRepository,
  AbstractContactsService,
} from 'src/app/interface/contacts';
import { ContactsSchemaModule } from 'src/app/models/contacts/contacts.schema.module';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { ContactsRepository } from 'src/app/repository/contacts/contacts.repository';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { S3Service } from 'src/app/services/s3/s3.service';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/app/services/user/user.service';
import { FileUploadSchemaModule } from 'src/app/models/file-upload/file-upload.schema.module';

@Module({
  imports: [ContactsSchemaModule, UserModule, FileUploadSchemaModule],
  controllers: [ContactsController],
  providers: [
    {
      provide: AbstractContactsRepository,
      useClass: ContactsRepository,
    },
    {
      provide: AbstractContactsService,
      useClass: ContactsService,
    },
    S3Service,
    UserService,
  ],

  exports: [ContactsSchemaModule],
})
export class ContactsModule {}
