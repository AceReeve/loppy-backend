import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Oauth, OauthSchema } from './aouth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Oauth.name, schema: OauthSchema }]),
  ],
  exports: [MongooseModule],
})
export class OauthSchemaModule {}
