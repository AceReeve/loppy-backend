import { Injectable, Inject } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { ConfigService } from '@nestjs/config';
import { MessageDTO } from 'src/app/dto/api/stripe';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';
import { twilio, twilioDocument } from 'src/app/models/twilio/twilio.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model
} from 'mongoose';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class TwilioService {
  constructor(
    @Inject(TwilioClient.TWILIO_CLIENT) private twilioClient: Twilio,
    protected readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(twilio.name) private twilioModel: Model<twilioDocument>,

  ) { }
  async twilioProvider(ssid: string, auth_token: string) {

    const accountSid = ssid;
    const authToken = auth_token;
    console.log('accountSid', accountSid);
    console.log('authToken', authToken);

    if (!accountSid || !authToken) {
      throw new Error('Twilio account SID and auth token must be provided');
    }
    return new Twilio(accountSid, authToken);
  }
  async twilioCredentials(ssid: string, auth_token: string, twilio_number: string) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email })
    const saveTwilio = await this.twilioModel.create({
      user_id: userData._id,
      ssid: ssid,
      auth_token: auth_token,
      twilio_number: twilio_number
    });
    return saveTwilio;
  }
  // async getTwilioInfo() {
  //   const user = this.request.user as Partial<User> & { sub: string };
  //   const userData = await this.userModel.findOne({ email: user.email })
  //   return await this.twilioModel.findOne({ user_id: userData._id });
  // }
  async sendMessage(messageDTO: MessageDTO) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email })
    let twilioInfo = await this.twilioModel.findOne({ user_id: userData._id });
    if (!twilioInfo) {
      throw new Error('This user doest not have twilio number');
    }
    await this.twilioProvider(twilioInfo.ssid, twilioInfo.auth_token)
    return this.twilioClient.messages.create({
      to: messageDTO.to,
      from: twilioInfo.twilio_number,
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
