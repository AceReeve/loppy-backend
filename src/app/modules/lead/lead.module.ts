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
import { UserService } from 'src/app/services/user/user.service';
import { UserModule } from '../user/user.module';
import { CronService } from 'src/app/cron/cron.service';
import { WorkFlowSchemaModule } from 'src/app/models/work-flow/work-flow.schema.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { PipelineSchemaModule } from 'src/app/models/pipeline/pipeline.schema.module';
import { EmailerService } from '@util/emailer/emailer';
import { SmsService } from 'src/config/sms/sms.service';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { PipelineRepository } from 'src/app/repository/pipeline/pipeline.repository';
import { MailerService ,MAILER_OPTIONS} from '@nestjs-modules/mailer';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { OtpSchemaModule } from 'src/app/models/otp/otp.schema.module';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { FileUploadSchemaModule } from 'src/app/models/file-upload/file-upload.schema.module';
import { TeamSchemaModule } from 'src/app/models/settings/manage-team/team/team.schema.module';
import { S3Service } from 'src/app/services/s3/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactsSchemaModule } from 'src/app/models/contacts/contacts.schema.module';
import { CustomerRepliedSchemaModule } from 'src/app/models/email/gmail.schema.module';
import { GmailService } from 'src/app/services/gmail/gmail.service';
import { TagsSchemaModule } from 'src/app/models/tags/tags.schema.module';


@Module({
  imports: [
    LeadSchemaModule,
    UserModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    OpportunitySchemaModule,
    WorkFlowSchemaModule,
    InvitedUserSchemaModule,
    PipelineSchemaModule,
    RoleSchemaModule,
    OtpSchemaModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    FileUploadSchemaModule,
    TeamSchemaModule,
    ContactsSchemaModule,
    CustomerRepliedSchemaModule,
    TagsSchemaModule
  ],
  controllers: [LeadController],
  // Inversion
  providers: [
    {
      provide: MAILER_OPTIONS,
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_NO_REPLY_ADDRESS')}>`,
        },
      }),
      inject: [ConfigService],
    },
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
    S3Service,
    AuthRepository,
    OauthRepository,
    JwtService,
    UserService,
    CronService,
    EmailerService,
    SmsService,
    UserRepository,
    PipelineRepository,
    MailerService,
    GmailService,
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
