import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './contacts.schema';
import {
  ContactsHistory,
  ContactsHistorySchema,
} from './contacts-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
      { name: ContactsHistory.name, schema: ContactsHistorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ContactsSchemaModule {}
