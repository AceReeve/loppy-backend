import { Module } from '@nestjs/common';
import { ApiModuleSchemaModule } from './api-module/api-module.schema.module';
import { DBEnvVarSchemaModule } from './db-env-variables/db-env-variables.schema.module';
import { PermissionSchemaModule } from './permission/permission.schema.module';
import { UserSchemaModule } from './user/user.schema.module';
import { RoleSchemaModule } from './role/role.schema.module';
import { twilioSchemaModule } from './twilio/twilio.schema.module';
import { InvitedUserSchemaModule } from './invited-users/invited-users.schema.module';
import { ContactsSchemaModule } from './contacts/contacts.schema.module';
import { OtpSchemaModule } from './otp/otp.schema.module';
import { MessagingTwilioSchemaModule } from './messaging-twilio/messaging-twilio.schema.module';
import { WorkFlowSchemaModule } from './work-flow/work-flow.schema.module';
import { TagsSchemaModule } from './tags/tags.schema.module';

@Module({
  imports: [
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    DBEnvVarSchemaModule,
    UserSchemaModule,
    RoleSchemaModule,
    twilioSchemaModule,
    InvitedUserSchemaModule,
    ContactsSchemaModule,
    OtpSchemaModule,
    MessagingTwilioSchemaModule,
    WorkFlowSchemaModule,
    TagsSchemaModule
  ],
  providers: [],
  exports: [
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    DBEnvVarSchemaModule,
    UserSchemaModule,
    RoleSchemaModule,
    twilioSchemaModule,
    InvitedUserSchemaModule,
    ContactsSchemaModule,
    OtpSchemaModule,
    MessagingTwilioSchemaModule,
    WorkFlowSchemaModule,
    TagsSchemaModule
  ],
})
export class ModelModule {}
