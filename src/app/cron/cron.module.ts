import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { WorkFlowSchemaModule } from '../models/work-flow/work-flow.schema.module';
import { UserSchemaModule } from '../models/user/user.schema.module';
import { EmailerService } from '@util/emailer/emailer';
import { MAILER_OPTIONS, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from 'src/config/sms/sms.service';
import { InvitedUserSchemaModule } from '../models/invited-users/invited-users.schema.module';
import { UserRepository } from '../repository/user/user.repository';
import { RoleSchemaModule } from '../models/role/role.schema.module';
import { OtpSchemaModule } from '../models/otp/otp.schema.module';
import { StripeEventSchemaModule } from '../models/stripe/stripe.event.schema.module';
import { WeatherForecastSchemaModule } from '../models/weatherforecast/weatherforecast.schema.module';
import { AuthRepository } from '../repository/auth/auth.repository';
import { FileUploadSchemaModule } from '../models/file-upload/file-upload.schema.module';
import { TeamSchemaModule } from '../models/settings/manage-team/team/team.schema.module';
import { S3Service } from '../services/s3/s3.service';
import { OauthRepository } from '../repository/oauth/oauth.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WorkFlowSchemaModule,
    UserSchemaModule,
    ConfigModule,
    InvitedUserSchemaModule,
    RoleSchemaModule,
    OtpSchemaModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    FileUploadSchemaModule,
    TeamSchemaModule,
  ],
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
    CronService,
    MailerService,
    EmailerService,
    SmsService,
    UserRepository,
    AuthRepository,
    S3Service,
    OauthRepository,
  ],
})
export class CronModule {}
