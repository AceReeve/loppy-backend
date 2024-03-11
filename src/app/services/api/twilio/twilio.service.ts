import { Injectable, Inject } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { ConfigService } from '@nestjs/config';
import { MessageDTO } from 'src/app/dto/api/stripe';

@Injectable()
export class TwilioService {
  constructor(
    @Inject(TwilioClient.TWILIO_CLIENT) private twilioClient: Twilio,
    protected readonly configService: ConfigService,
  ) { }

  async sendMessage(messageDTO: MessageDTO) {
    return this.twilioClient.messages.create({
      to: messageDTO.to,
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      body: messageDTO.body,
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

  async getAllMessages() {
    try {
      const messages = await this.twilioClient.messages.list();
      const groupedMessages: { [to: string]: any[] } = {};

      //group the messages by to:phone number
      messages.forEach(message => {
        if (!groupedMessages[message.to]) {
          groupedMessages[message.to] = [];
        }
        groupedMessages[message.to].push({
          sid: message.sid,
          status: message.status,
          dateSent: message.dateSent,
          body: message.body,
          from: message.from
        });
      });

      return groupedMessages;
    } catch (error) {
      throw new Error('Failed to fetch messages: ' + error.message);
    }
  }
}
