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
import { UserRepository } from 'src/app/repository/user/user.repository';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { OtpSchemaModule } from 'src/app/models/otp/otp.schema.module';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { EmailerService } from '@util/emailer/emailer';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { FileUploadSchemaModule } from 'src/app/models/file-upload/file-upload.schema.module';
import { TeamSchemaModule } from 'src/app/models/settings/manage-team/team/team.schema.module';
import { S3Service } from 'src/app/services/s3/s3.service';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { MailerService,MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactsSchemaModule } from 'src/app/models/contacts/contacts.schema.module';

@Module({
  imports: [
    PipelineSchemaModule,
    UserModule,
    PermissionSchemaModule,
    ApiModuleSchemaModule,
    RoleSchemaModule,
    OtpSchemaModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    InvitedUserSchemaModule,
    FileUploadSchemaModule,
    TeamSchemaModule,
    ContactsSchemaModule
  ],
  controllers: [PipelineController],
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
    UserRepository,
    EmailerService,
    AuthRepository,
    S3Service,
    MailerService,
    OauthRepository,
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
