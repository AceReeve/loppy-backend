import { Injectable, Inject } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  constructor(
    @Inject(TwilioClient.TWILIO_CLIENT) private twilioClient: Twilio,
    protected readonly configService: ConfigService,
  ) {}

  async sendMessage(to: string, body: string) {
    return this.twilioClient.messages.create({
      to,
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      body,
    });
  }

  async getMessageStatus(messageSid: string) {
    try {
      const message = await this.twilioClient.messages(messageSid).fetch();
      return {
        status: message.status,
        errorMessage: message.errorMessage,
        dateSent: message.dateSent,
      };
    } catch (error) {
      throw new Error('Failed to fetch message status: ' + error.message);
    }
  }
}
