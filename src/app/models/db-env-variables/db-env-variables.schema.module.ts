import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DBEnvVar, DBEnvVarSchema } from './db-env-variables.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DBEnvVar.name, schema: DBEnvVarSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DBEnvVarSchemaModule {}
