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
import { TwilioA2PModule } from './app/modules/api/twilio/twilio.a2p.module';
import { PipelineModule } from './app/modules/pipeline/pipeline.module';
import { LeadTriggerModule } from './app/modules/lead-trigger/lead-trigger.module';

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
    TwilioA2PModule
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  static allowedOrigins: string[] | null;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
