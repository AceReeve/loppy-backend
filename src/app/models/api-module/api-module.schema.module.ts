import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModuleSchema, ApiModule } from './api-module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiModule.name, schema: ApiModuleSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ApiModuleSchemaModule {}
