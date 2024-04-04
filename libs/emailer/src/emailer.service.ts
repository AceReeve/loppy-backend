import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailerService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  private readonly logger = new Logger(EmailerService.name);

  async inviteUser<T extends {
    email: string
  }>(data: T, claim?: string,
  ): Promise<any> {
    const { email } = data
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You are invited testing`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
