import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { MailerService, MailerModule, MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule,
    ConfigModule,
  ],
  providers: [
    EmailerService, MailerService,
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
  exports: [EmailerService],
})
export class EmailerModule { }
