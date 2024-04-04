import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractEmailNotificationService } from 'src/app/interface/email-notification';

@ApiTags('Email Notification')
@Controller('email-notification')
export class EmailNotificationController {
  constructor(emailNotificationService: AbstractEmailNotificationService) {}
}
