import { Injectable } from '@nestjs/common';
import { AbstractEmailNotificationService } from 'src/app/interface/email-notification';

@Injectable()
export class EmailNotificationService
  implements AbstractEmailNotificationService {}
