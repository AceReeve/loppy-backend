import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitedMember, InvitedMemberSchema } from './manage-team.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvitedMember.name, schema: InvitedMemberSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class InvitedMemberSchemaModule {}
