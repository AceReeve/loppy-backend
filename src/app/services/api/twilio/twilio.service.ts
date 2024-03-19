import { Injectable, Inject } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { ConfigService } from '@nestjs/config';
import { MessageDTO } from 'src/app/dto/api/stripe';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';
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
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfoDocument>,
  ) { }

  async sendMessage(messageDTO: MessageDTO) {
    const user = this.request.user as Partial<User> & { sub: string };
    let userInfo: UserInfo | null = await this.userInfoModel.findOne({ user_id: user.sub });
    if (!userInfo.twillio_number) {
      throw new Error('twilio should not be empty');
    }
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
