import { Module } from '@nestjs/common';
import {
  AbstractLeadRepository,
  AbstractLeadService,
} from 'src/app/interface/lead';
import { LeadController } from 'src/app/controller/lead/lead.controller';
import { LeadSchemaModule } from 'src/app/models/lead/lead.schema.module';
import { PermissionSchemaModule } from 'src/app/models/permission/permission.schema.module';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import { PermissionRepository } from 'src/app/repository/permission/permission.repository';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
import { ApiModuleRepository } from 'src/app/repository/api-module/api-module.repository';
import { ApiModuleSchemaModule } from 'src/app/models/api-module/api-module.schema.module';
import { JwtService } from '@nestjs/jwt';
import { LeadService } from 'src/app/services/lead/lead.service';
import { LeadRepository } from 'src/app/repository/lead/lead.repository';
import { OpportunitySchemaModule } from 'src/app/models/opportunity/opportunity.schema.module';

@Module({
  imports: [
    LeadSchemaModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    OpportunitySchemaModule,
  ],
  controllers: [LeadController],
  // Inversion
  providers: [
    {
      provide: AbstractLeadService,
      useClass: LeadService,
    },
    {
      provide: AbstractLeadRepository,
      useClass: LeadRepository,
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
      provide: AbstractLeadService,
      useClass: LeadService,
    },
    {
      provide: AbstractLeadRepository,
      useClass: LeadRepository,
    },
  ],
})
export class LeadModule {}
