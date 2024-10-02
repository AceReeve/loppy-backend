import { Module } from '@nestjs/common';
import {
  AbstractOpportunityRepository,
  AbstractOpportunityService,
} from 'src/app/interface/opportunity';
import { OpportunityController } from 'src/app/controller/opportunity/opportunity.controller';
import { OpportunitySchemaModule } from 'src/app/models/opportunity/opportunity.schema.module';
import { PermissionSchemaModule } from 'src/app/models/permission/permission.schema.module';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import { PermissionRepository } from 'src/app/repository/permission/permission.repository';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
import { ApiModuleRepository } from 'src/app/repository/api-module/api-module.repository';
import { ApiModuleSchemaModule } from 'src/app/models/api-module/api-module.schema.module';
import { JwtService } from '@nestjs/jwt';
import { OpportunityService } from 'src/app/services/opportunity/opportunity.service';
import { OpportunityRepository } from 'src/app/repository/opportunity/opportunity.repository';

@Module({
  imports: [
    OpportunitySchemaModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
  ],
  controllers: [OpportunityController],
  // Inversion
  providers: [
    {
      provide: AbstractOpportunityService,
      useClass: OpportunityService,
    },
    {
      provide: AbstractOpportunityRepository,
      useClass: OpportunityRepository,
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
      provide: AbstractOpportunityService,
      useClass: OpportunityService,
    },
    {
      provide: AbstractOpportunityRepository,
      useClass: OpportunityRepository,
    },
  ],
})
export class OpportunityModule {}
