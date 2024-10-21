import { Module } from '@nestjs/common';
import { PermissionSchemaModule } from 'src/app/models/permission/permission.schema.module';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import { PermissionRepository } from 'src/app/repository/permission/permission.repository';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
import { ApiModuleRepository } from 'src/app/repository/api-module/api-module.repository';
import { ApiModuleSchemaModule } from 'src/app/models/api-module/api-module.schema.module';
import { JwtService } from '@nestjs/jwt';
import { OpportunitySchemaModule } from 'src/app/models/opportunity/opportunity.schema.module';
import { UserService } from 'src/app/services/user/user.service';
import { UserModule } from '../user/user.module';
import {
  AbstractLeadTriggerRepository,
  AbstractLeadTriggerService,
} from 'src/app/interface/lead-trigger';
import { LeadTriggerService } from 'src/app/services/lead-trigger/lead-trigger.service';
import { LeadTriggerRepository } from 'src/app/repository/lead-trigger/lead-trigger.repository';
import { LeadTriggerSchemaModule } from 'src/app/models/lead-trigger/lead-trigger.schema.module';
import { LeadTriggerController } from 'src/app/controller/lead-trigger/lead-trigger.controller';

@Module({
  imports: [
    LeadTriggerSchemaModule,
    UserModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    OpportunitySchemaModule,
  ],
  controllers: [LeadTriggerController],
  // Inversion
  providers: [
    {
      provide: AbstractLeadTriggerService,
      useClass: LeadTriggerService,
    },
    {
      provide: AbstractLeadTriggerRepository,
      useClass: LeadTriggerRepository,
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
      provide: AbstractLeadTriggerService,
      useClass: LeadTriggerService,
    },
    {
      provide: AbstractLeadTriggerRepository,
      useClass: LeadTriggerRepository,
    },
  ],
})
export class LeadTriggerModule {}
