import { Module } from '@nestjs/common';
import {
  AbstractPipelineRepository,
  AbstractPipelineService,
} from 'src/app/interface/pipeline';
import { PipelineController } from 'src/app/controller/pipeline/pipeline.controller';
import { PipelineSchemaModule } from 'src/app/models/pipeline/pipeline.schema.module';
import { PermissionSchemaModule } from 'src/app/models/permission/permission.schema.module';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import { PermissionRepository } from 'src/app/repository/permission/permission.repository';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
import { ApiModuleRepository } from 'src/app/repository/api-module/api-module.repository';
import { ApiModuleSchemaModule } from 'src/app/models/api-module/api-module.schema.module';
import { JwtService } from '@nestjs/jwt';
import { PipelineService } from 'src/app/services/pipeline/pipeline.service';
import { PipelineRepository } from 'src/app/repository/pipeline/pipeline.repository';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/app/services/user/user.service';

@Module({
  imports: [
    PipelineSchemaModule,
    UserModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
  ],
  controllers: [PipelineController],
  // Inversion
  providers: [
    {
      provide: AbstractPipelineService,
      useClass: PipelineService,
    },
    {
      provide: AbstractPipelineRepository,
      useClass: PipelineRepository,
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
    UserService,
  ],

  exports: [
    {
      provide: AbstractPipelineService,
      useClass: PipelineService,
    },
    {
      provide: AbstractPipelineRepository,
      useClass: PipelineRepository,
    },
  ],
})
export class PipelineModule {}
