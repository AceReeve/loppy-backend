import { Module } from '@nestjs/common';
import {
  AbstractRoleRepository,
  AbstractRoleService,
} from 'src/app/interface/role';
import { RoleService } from 'src/app/services/role/role.service';
import { RoleController } from 'src/app/controller/role/role.controller';
import { RoleRepository } from 'src/app/repository/role/role.repository';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { PermissionSchemaModule } from 'src/app/models/permission/permission.schema.module';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import { PermissionRepository } from 'src/app/repository/permission/permission.repository';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
import { ApiModuleRepository } from 'src/app/repository/api-module/api-module.repository';
import { ApiModuleSchemaModule } from 'src/app/models/api-module/api-module.schema.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [RoleSchemaModule, PermissionSchemaModule, ApiModuleSchemaModule],
  controllers: [RoleController],
  // Inversion
  providers: [
    {
      provide: AbstractRoleService,
      useClass: RoleService,
    },
    {
      provide: AbstractRoleRepository,
      useClass: RoleRepository,
    },
    {
      provide: AbstractPermissionRepository,
      useClass: PermissionRepository,
    },
    {
      provide: AbstractApiModuleRepository,
      useClass: ApiModuleRepository,
    },
    JwtService,
  ],

  exports: [
    {
      provide: AbstractRoleService,
      useClass: RoleService,
    },
    {
      provide: AbstractRoleRepository,
      useClass: RoleRepository,
    },
  ],
})
export class RoleModule {}
