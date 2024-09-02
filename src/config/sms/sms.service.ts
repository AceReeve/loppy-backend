import { Injectable } from '@nestjs/common';
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

  async sendSms(to: string, body: string): Promise<any> {
    try {
      const message = await this.twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      console.log('Message sent successfully', message.sid);
      return message;
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
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
}
