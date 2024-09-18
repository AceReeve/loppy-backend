import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { WorkFlowSchemaModule } from '../models/work-flow/work-flow.schema.module';
import { UserSchemaModule } from '../models/user/user.schema.module';
import { EmailerService } from '@util/emailer/emailer';
import { MAILER_OPTIONS, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from 'src/config/sms/sms.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WorkFlowSchemaModule,
    UserSchemaModule,
    ConfigModule, // Ensure ConfigModule is imported
  ],
  providers: [
    CronService,
    MailerService,
    EmailerService,
    SmsService,
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
  ],
})
export class CronModule {}
