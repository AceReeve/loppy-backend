import { Inject, Injectable } from '@nestjs/common';
import { jwt, Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { MessageDTO } from 'src/app/dto/api/stripe';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import { twilio, twilioDocument } from 'src/app/models/twilio/twilio.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  constructor(
    protected readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(twilio.name) private twilioModel: Model<twilioDocument>,
  ) {}
  private async initializeTwilioClient(userId: string) {
    const userData = await this.userModel.findById(userId).exec();
    if (!userData) {
      throw new Error('User not found');
    }
    const twilioInfo = await this.twilioModel
      .findOne({ user_id: userId })
      .exec();
    if (!twilioInfo) {
      throw new Error('Twilio information not found for the user');
    }
    const { ssid, auth_token } = twilioInfo;
    this.twilioClient = new Twilio(ssid, auth_token);
  }
  async twilioCredentials(
    ssid: string,
    auth_token: string,
    twilio_number: string,
  ) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const twilioInfo = await this.twilioModel
      .findOne({ user_id: userData._id })
      .exec();
    if (twilioInfo) {
      throw new Error('Already have Twilio information for this user');
    }
    return await this.twilioModel.create({
      user_id: new Types.ObjectId(userData._id),
      ssid: ssid,
      auth_token: auth_token,
      twilio_number: twilio_number,
    });
  }
  async getTwilioAccessToken() {
    const user = this.request.user as Partial<User> & { sub: string };

    const AccessToken = jwt.AccessToken;
    const ChatGrant = AccessToken.ChatGrant;

    // Used when generating any kind of tokens
    // To set up environmental variables, see http://twil.io/secure
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioApiKey = process.env.TWILIO_API_KEY_SID;
    const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET;

    // Used specifically for creating Chat tokens
    const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;
    const identity = user.email;

    // Create a "grant" which enables a client to use Chat as a given user,
    // on a given device
    const chatGrant = new ChatGrant({
      serviceSid: serviceSid,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity, ttl: 43200 },
    );

    token.addGrant(chatGrant);

    // Serialize the token to a JWT string
    return token.toJwt();
  }
  async sendMessage(messageDTO: MessageDTO) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    await this.initializeTwilioClient(userData._id);
    let twilioInfo = await this.twilioModel.findOne({ user_id: userData._id });
    if (!twilioInfo) {
      throw new Error('This user doest not have twilio number');
    }
    return this.twilioClient.messages.create({
      to: messageDTO.to,
      from: twilioInfo.twilio_number,
      body: messageDTO.body,
    });
  }

  async getMessageStatus(messageSid: string) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    await this.initializeTwilioClient(userData._id);
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
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    await this.initializeTwilioClient(userData._id);
    try {
      const messages = await this.twilioClient.messages.list();
      const groupedMessages: { [to: string]: any[] } = {};

      //group the messages by to:phone number
      messages.forEach((message) => {
        if (!groupedMessages[message.to]) {
          groupedMessages[message.to] = [];
        }
        groupedMessages[message.to].push({
          sid: message.sid,
          status: message.status,
          dateSent: message.dateSent,
          body: message.body,
          from: message.from,
        });
      });

      return groupedMessages;
    } catch (error) {
      throw new Error('Failed to fetch messages: ' + error.message);
    }
  }
  async getAllContacts() {
    const twilioData = await this.twilioModel.find();
    const result = [];

    for (const twilio of twilioData) {
      const userData = await this.userInfoModel.findOne({
        user_id: twilio.user_id,
      });
      const firstname = userData ? userData.first_name : 'Unknown';
      const lastname = userData ? userData.last_name : 'Unknown';
      const name = `${firstname} ${lastname}`;
      const lastMessage = await this.generateRandomMessage();
      const twilioDataWithUserInfo = {
        ...twilio.toObject(),
        name,
        lastMessage,
      };
      result.push(twilioDataWithUserInfo);
    }

    return result;
  }

  async generateRandomMessage() {
    const messages = [
      'Hey, how are you?',
      "What's up?",
      'Good morning!',
      "How's your day going?",
      'Did you hear about the latest news?',
      'Just checking in!',
      'Remember to complete the task!',
      'Looking forward to seeing you soon.',
      "Hope you're having a great day!",
      'Take care!',
      "Let's catch up soon.",
      'Happy weekend!',
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);

    // Return the random message
    return messages[randomIndex];
  }
}
