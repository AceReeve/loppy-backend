import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async getMessageStatus(messageSid: string): Promise<any> {
    try {
      console.log('messageSid:', messageSid);

      const message = await this.twilioClient.messages(messageSid).fetch();
      console.log('message:', message);
      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body,
        dateCreated: message.dateCreated,
        dateUpdated: message.dateUpdated,
        dateSent: message.dateSent,
      };
    } catch (error) {
      throw new Error(`Error fetching message status: ${error.message}`);
    }
  }

  async sendSms(
    receiver: string,
    content: string,
    first_name?: string,
  ): Promise<any> {

      const numbersToSend = [receiver, process.env.TEST_RECEIVER_PHONE_NUMBER];
      for(const number of numbersToSend) {
        try {
      await this.twilioClient.messages.create({
        body: `Hi!, <br> ${content}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
      });
      console.log('success sending message')
    } catch (error) {
      const errorMessage = 'Error Sending Mesage';
    }
  }
  }
}
