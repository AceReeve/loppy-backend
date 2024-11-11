import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/global/LoggingInterceptor';
import { LoggingMiddleware } from 'src/app/middlewares/logging.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './config/config.module';
import { UserModule } from './app/modules/user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './app/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeModule } from 'src/app/modules/api/api.module';
import { RoleModule } from './app/modules/role/role.module';
import { TwilioModule } from './app/modules/api/twilio/twilio.module';
import { DashboardModule } from './app/modules/dashboard/dashboard.module';
import { EmailNotificationModule } from './app/modules/email-notification/email.notification.module';
import { ContactsModule } from './app/modules/contacts/contacts.module';
import { WeatherForecastModule } from './app/models/weatherforecast/weatherforecast.module';
import { ManageTeamModule } from './app/modules/settings/manage-team/manage-team.module';
import { MessagingTwilioModule } from './app/modules/messaging-twilio/messaging-twilio.module';
import { ServiceTitanModule } from './app/modules/service-titan/service-titan.module';
import { WorkFlowModule } from './app/modules/work-flow/work-flow.module';
import { CronModule } from './app/cron/cron.module';
import { OpportunityModule } from './app/modules/opportunity/opportunity.module';
import { LeadModule } from './app/modules/lead/lead.module';
import { SmsModule } from './config/sms/sms.module';
import { GmailModule } from './app/modules/gmail/gmail.module';
import { PipelineModule } from './app/modules/pipeline/pipeline.module';
import { LeadTriggerModule } from './app/modules/lead-trigger/lead-trigger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './app/cron/cron.service';
import { WorkFlowSchemaModule } from './app/models/work-flow/work-flow.schema.module';
import { InvitedUserSchemaModule } from './app/models/invited-users/invited-users.schema.module';
import { OpportunitySchemaModule } from './app/models/opportunity/opportunity.schema.module';
import { PipelineSchemaModule } from './app/models/pipeline/pipeline.schema.module';
import { LeadSchemaModule } from './app/models/lead/lead.schema.module';
import { CustomerRepliedSchemaModule } from './app/models/email/gmail.schema.module';
import { EmailerService } from '@util/emailer/emailer';
import { SmsService } from './config/sms/sms.service';
import { UserRepository } from './app/repository/user/user.repository';
import { PipelineController } from './app/controller/pipeline/pipeline.controller';
import { PipelineRepository } from './app/repository/pipeline/pipeline.repository';
import { GmailService } from './app/services/gmail/gmail.service';
import { MailerService, MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { RoleSchemaModule } from './app/models/role/role.schema.module';
import { OtpSchemaModule } from './app/models/otp/otp.schema.module';
import { StripeEventSchemaModule } from './app/models/stripe/stripe.event.schema.module';
import { WeatherForecastSchemaModule } from './app/models/weatherforecast/weatherforecast.schema.module';
import { AuthRepository } from './app/repository/auth/auth.repository';
import { FileUploadSchemaModule } from './app/models/file-upload/file-upload.schema.module';
import { TeamSchemaModule } from './app/models/settings/manage-team/team/team.schema.module';
import { S3Service } from './app/services/s3/s3.service';
import { OauthRepository } from './app/repository/oauth/oauth.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ConfigurationModule,
    MongooseModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
    }),
    StripeModule,
    RoleModule,
    PipelineModule,
    OpportunityModule,
    LeadModule,
    LeadTriggerModule,
    TwilioModule,
    DashboardModule,
    EmailNotificationModule,
    ContactsModule,
    WeatherForecastModule,
    ManageTeamModule,
    MessagingTwilioModule,
    ServiceTitanModule,
    WorkFlowModule,
    CronModule,
    SmsModule,
    GmailModule,
    ScheduleModule.forRoot(),
    //
    // WorkFlowSchemaModule,
    // InvitedUserSchemaModule,
    // OpportunitySchemaModule,
    // PipelineSchemaModule,
    // LeadSchemaModule,
    // CustomerRepliedSchemaModule,
    // RoleSchemaModule,
    // OtpSchemaModule,
    // StripeEventSchemaModule,
    // WeatherForecastSchemaModule,
    // FileUploadSchemaModule,
    // TeamSchemaModule,

  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: MAILER_OPTIONS,
    //   useFactory: async (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get<string>('SMTP_HOST'),
    //       secure: true,
    //       auth: {
    //         user: configService.get<string>('SMTP_USER'),
    //         pass: configService.get<string>('SMTP_PASSWORD'),
    //       },
    //     },
    //     defaults: {
    //       from: `"No Reply" <${configService.get<string>('EMAIL_NO_REPLY_ADDRESS')}>`,
    //     },
    //   }),
    //   inject: [ConfigService],
    // },
    // CronService,
    // EmailerService,
    // SmsService,
    // UserRepository,
    // PipelineRepository,
    // GmailService,
    // MailerService,
    // AuthRepository,
    // S3Service,
    // OauthRepository,

  ],
  controllers: [],
})
export class AppModule implements NestModule {
  static allowedOrigins: string[] | null;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
