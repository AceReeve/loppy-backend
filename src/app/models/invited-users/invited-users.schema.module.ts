import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitedUser, InvitedUserSchema } from './invited-users.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvitedUser.name, schema: InvitedUserSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class InvitedUserSchemaModule {}
