import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MaileService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MaileService,
    }),
  ],
})
export class MailModule {}
