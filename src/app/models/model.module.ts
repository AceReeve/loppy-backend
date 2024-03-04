import { Module } from '@nestjs/common';
import { ApiModuleSchemaModule } from './api-module/api-module.schema.module';
import { DBEnvVarSchemaModule } from './db-env-variables/db-env-variables.schema.module';
import { PermissionSchemaModule } from './permission/permission.schema.module';
import { UserSchemaModule } from './user/user.schema.module';


@Module({
  imports: [
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    DBEnvVarSchemaModule,
    UserSchemaModule,
  ],
  providers: [],
  exports: [
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    DBEnvVarSchemaModule,
    UserSchemaModule,
  ],
})
export class ModelModule { }
