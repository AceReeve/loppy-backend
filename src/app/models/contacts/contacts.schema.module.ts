import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './contacts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ContactsSchemaModule {}
