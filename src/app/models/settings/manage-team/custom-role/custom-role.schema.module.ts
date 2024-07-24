import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomeRole, CustomeRoleSchema } from './custom-role.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomeRole.name, schema: CustomeRoleSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class CustomeRoleSchemaModule {}
