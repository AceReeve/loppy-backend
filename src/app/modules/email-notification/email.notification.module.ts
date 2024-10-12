import { Module } from '@nestjs/common';
import { EmailerModule } from '@util/emailer/emailer';
import { EmailNotificationController } from 'src/app/controller/email-notification/email-notification.controller';
import { AbstractEmailNotificationService } from 'src/app/interface/email-notification';
import { RepositoryModule } from 'src/app/repository/repository.module';
import { EmailNotificationService } from 'src/app/services/email-notification/email-notification.service';

@Module({
  imports: [RepositoryModule, EmailerModule],
  controllers: [EmailNotificationController],
  providers: [
    {
      provide: AbstractEmailNotificationService,
      useClass: EmailNotificationService,
    },
  ],
})
export class EmailNotificationModule {}
