import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioInboxes, TwilioInboxesSchema } from './inboxes/inboxes.schema';
import {
  TwilioOrganizations,
  TwilioOrganizationsSchema,
} from './organization/organization.schema';
import {
  TwilioNumber,
  TwilioNumberSchema,
} from './purchase-number/twilio-number.schema';
import {
  ActivatedTwilioOrganizations,
  ActivatedTwilioOrganizationsSchema,
} from './organization/activated-organization.schema';
import {
  ActivatedTwilioInboxes,
  ActivatedTwilioInboxesSchema,
} from './inboxes/activated-inboxes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TwilioInboxes.name, schema: TwilioInboxesSchema },
    ]),
    MongooseModule.forFeature([
      { name: TwilioOrganizations.name, schema: TwilioOrganizationsSchema },
    ]),
    MongooseModule.forFeature([
      { name: TwilioNumber.name, schema: TwilioNumberSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: ActivatedTwilioOrganizations.name,
        schema: ActivatedTwilioOrganizationsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ActivatedTwilioInboxes.name,
        schema: ActivatedTwilioInboxesSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class MessagingTwilioSchemaModule {}
