import { Module, Global } from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import { TwilioController } from 'src/app/controller/api/twilio/twilio.controller';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/services/user/user.service';
import { UserModule } from 'src/app/modules/user/user.module';
import { AbstractUserRepository } from 'src/app/interface/user';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { EmailerModule } from '@util/emailer/emailer';
import { twilioSchemaModule } from 'src/app/models/twilio/twilio.schema.module';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { OtpSchemaModule } from 'src/app/models/otp/otp.schema.module';
import { FileUploadSchemaModule } from 'src/app/models/file-upload/file-upload.schema.module';
import { S3Service } from 'src/app/services/s3/s3.service';
import { WorkFlowSchemaModule } from 'src/app/models/work-flow/work-flow.schema.module';
import {
  AbstractWorkFlowRepository,
  AbstractWorkFlowService,
} from 'src/app/interface/react-flow';
import { WorkFlowRepository } from 'src/app/repository/work-flow/work-flow.repository';
import { WorkFlowService } from 'src/app/services/work-flow/work-flow.service';
import { WorkFlowController } from 'src/app/controller/react-flow/react-flow.controller';
import { StripeModule } from '../api/api.module';
import { CronService } from 'src/app/cron/cron.service';
import { TeamSchemaModule } from 'src/app/models/settings/manage-team/team/team.schema.module';
import { SmsService } from 'src/config/sms/sms.service';
import { OpportunitySchemaModule } from 'src/app/models/opportunity/opportunity.schema.module';
import { PipelineSchemaModule } from 'src/app/models/pipeline/pipeline.schema.module';
import { LeadSchemaModule } from 'src/app/models/lead/lead.schema.module';
import { PipelineRepository } from 'src/app/repository/pipeline/pipeline.repository';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { TagsSchemaModule } from 'src/app/models/tags/tags.schema.module';
import { ContactsSchemaModule } from 'src/app/models/contacts/contacts.schema.module';
import { CustomerRepliedSchemaModule } from 'src/app/models/email/gmail.schema.module';
import { GmailService } from 'src/app/services/gmail/gmail.service';
@Global()
@Module({
  imports: [
    UserSchemaModule,
    UserModule,
    WorkFlowSchemaModule,
    RoleSchemaModule,
    OtpSchemaModule,
    StripeModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    InvitedUserSchemaModule,
    EmailerModule,
    FileUploadSchemaModule,
    TeamSchemaModule,
    OpportunitySchemaModule,
    LeadSchemaModule,
    PipelineSchemaModule,
    WeatherForecastSchemaModule,
    TagsSchemaModule,
    ContactsSchemaModule,
    CustomerRepliedSchemaModule
  ],
  providers: [
    UserService,
    UserRepository,
    AuthRepository,
    S3Service,
    OauthRepository,
    CronService,
    SmsService,
    PipelineRepository,
    ServiceTitanService,
    HttpService,
    GmailService,
    {
      provide: AbstractWorkFlowRepository,
      useClass: WorkFlowRepository,
    },
    {
      provide: AbstractWorkFlowService,
      useClass: WorkFlowService,
    },
    {
      provide: 'AXIOS_INSTANCE_TOKEN',
      useFactory: () => axios.create(),
    },
  ],
  controllers: [WorkFlowController],
  exports: ['AXIOS_INSTANCE_TOKEN', HttpService],
})
export class WorkFlowModule {}
