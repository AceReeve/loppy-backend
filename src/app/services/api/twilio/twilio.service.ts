import { Inject, Injectable } from '@nestjs/common';
import { jwt, Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { MessageDTO, TwilioCredDTO } from 'src/app/dto/api/stripe';
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
import * as crypto from 'crypto';
const algorithm = 'aes-256-ctr';

const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(process.env.TWILIO_API_KEY_SECRET),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (hash: string): string => {
  const [iv, encrypted] = hash.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(process.env.TWILIO_API_KEY_SECRET),
    Buffer.from(iv, 'hex'),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
};

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  constructor(
    protected readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(twilio.name) private twilioModel: Model<twilioDocument>,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }
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
    const { twilio_account_sid, twilio_auth_token } = twilioInfo;
    this.twilioClient = new Twilio(twilio_account_sid, twilio_auth_token);
  }
  async twilioCredentials(twilioCredDTO: TwilioCredDTO) {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });

    try {
      // Check if any of the Twilio credentials already exist for another user
      const existingTwilio = await this.twilioModel.findOne({
        $or: [
          { twilio_account_sid: twilioCredDTO.twilio_account_sid },
          { twilio_chat_service_sid: twilioCredDTO.twilio_chat_service_sid },
          { twilio_api_key_sid: twilioCredDTO.twilio_api_key_sid },
          { twilio_api_key_secret: twilioCredDTO.twilio_api_key_secret },
          { twilio_auth_token: twilioCredDTO.twilio_auth_token },
          { twilio_number: twilioCredDTO.twilio_number },
        ],
        user_id: { $ne: userData._id }, // Exclude current user's credentials
      });

      if (existingTwilio) {
        throw new Error(
          'One or more Twilio credentials already exist for another user.',
        );
      }

      // Check if twilio credentials already exist for the user
      const twilioInfo = await this.twilioModel.findOne({
        user_id: userData._id,
      });

      if (twilioInfo) {
        // Update existing twilio credentials
        const updatedTwilio = await this.twilioModel.findOneAndUpdate(
          { user_id: userData._id },
          {
            $set: {
              twilio_account_sid: twilioCredDTO.twilio_account_sid,
              twilio_chat_service_sid: twilioCredDTO.twilio_chat_service_sid,
              twilio_api_key_sid: twilioCredDTO.twilio_api_key_sid,
              twilio_api_key_secret: twilioCredDTO.twilio_api_key_secret,
              twilio_auth_token: twilioCredDTO.twilio_auth_token,
              twilio_number: twilioCredDTO.twilio_number,
            },
          },
          { runValidators: true, new: true }, // Ensure validation and return updated document
        );

        return updatedTwilio;
      } else {
        // Create new twilio credentials if none exist
        const newTwilio = await this.twilioModel.create({
          user_id: userData._id,
          twilio_account_sid: twilioCredDTO.twilio_account_sid,
          twilio_chat_service_sid: twilioCredDTO.twilio_chat_service_sid,
          twilio_api_key_sid: twilioCredDTO.twilio_api_key_sid,
          twilio_api_key_secret: twilioCredDTO.twilio_api_key_secret,
          twilio_auth_token: twilioCredDTO.twilio_auth_token,
          twilio_number: twilioCredDTO.twilio_number,
        });

        return newTwilio;
      }
    } catch (error) {
      // Handle any validation or database errors
      throw new Error(
        `Failed to update/create twilio credentials: ${error.message}`,
      );
    }
  }
  async getTwilioAccessToken() {
    const user = this.request.user as Partial<User> & { sub: string };
    const userDetails = await this.userModel.findOne({ email: user.email });
    const twilioCred = await this.twilioModel.findOne({
      user_id: userDetails._id,
    });
    const AccessToken = jwt.AccessToken;
    const ChatGrant = AccessToken.ChatGrant;

    // Used when generating any kind of tokens
    // To set up environmental variables, see http://twil.io/secure
    const twilioAccountSid = twilioCred.twilio_account_sid;
    const twilioApiKey = twilioCred.twilio_api_key_sid;
    const twilioApiSecret = twilioCred.twilio_api_key_secret;

    // Used specifically for creating Chat tokens
    const serviceSid = twilioCred.twilio_chat_service_sid;
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
    const twilioInfo = await this.twilioModel.findOne({
      user_id: userData._id,
    });
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

  async getTwilioCredentials() {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });

    return await this.twilioModel.findOne({ user_id: userData._id });
  }

  async createSubAccount(friendlyName: string): Promise<any> {
    try {
      const user = this.request.user as Partial<User> & { sub: string };
      const userData = await this.userModel.findOne({ email: user.email });

      // Create the subaccount
      const subAccount = await this.twilioClient.api.accounts.create({
        friendlyName,
      });

      // Initialize Twilio client for the subaccount
      const subAccountClient = new Twilio(subAccount.sid, subAccount.authToken);

      // Create an API Key for the subaccount
      const apiKey = await subAccountClient.newKeys.create();

      // Create a Chat Service for the subaccount
      const chatService = await subAccountClient.chat.services.create({
        friendlyName: `${friendlyName} Chat Service`,
      });

      // Fetch the first available phone number (free number for trial account)
      const encryptedAccountSid = encrypt(subAccount.sid);
      const encryptedAuthToken = encrypt(subAccount.authToken);
      const encryptedApiKeySid = encrypt(apiKey.sid);
      const encryptedApiKeySecret = encrypt(apiKey.secret);
      const encryptedChatServiceSid = encrypt(chatService.sid);
      // Save the details in your database (e.g., twilioModel)
      const twilioData = new this.twilioModel({
        user_id: userData._id,
        twilio_account_sid: encryptedAccountSid,
        twilio_auth_token: encryptedAuthToken,
        twilio_api_key_sid: encryptedApiKeySid,
        twilio_api_key_secret: encryptedApiKeySecret,
        twilio_chat_service_sid: encryptedChatServiceSid,
        status: subAccount.status,
      });
      await twilioData.save();

      return {
        TWILIO_ACCOUNT_SID: subAccount.sid,
        TWILIO_API_KEY_SID: apiKey.sid,
        TWILIO_API_KEY_SECRET: apiKey.secret,
        TWILIO_CHAT_SERVICE_SID: chatService.sid,
      };
    } catch (error) {
      throw new Error(`Failed to create subaccount: ${error.message}`);
    }
  }

  async getSubAccount(sid: string): Promise<any> {
    try {
      const subAccount = await this.twilioClient.api.accounts(sid).fetch();
      // const twilioData = await this.twilioModel.findOne({ accountSid: sid });

      return subAccount;

      // return {
      //   ...subAccount,
      //   apiKeySid: decrypt(twilioData.twilio_api_key_sid),
      //   apiKeySecret: decrypt(twilioData.twilio_api_key_secret),
      //   chatServiceSid: decrypt(twilioData.twilio_chat_service_sid),
      //   phoneNumber: twilioData.twilio_number,
      // };
    } catch (error) {
      throw new Error(`Failed to fetch subaccount: ${error.message}`);
    }
  }

  async getAllSubAccounts(): Promise<any> {
    try {
      const subAccounts = await this.twilioClient.api.accounts.list();
      return subAccounts;
    } catch (error) {
      throw new Error(`Failed to fetch subaccounts: ${error.message}`);
    }
  }

  async getAllSubAccountsInDatabase(): Promise<any> {
    try {
      const twilioData = await this.twilioModel.find();
      return twilioData;
    } catch (error) {
      throw new Error(`Failed to fetch subaccount: ${error.message}`);
    }
  }
  async deleteSubAccount(sid: string): Promise<any> {
    try {
      const closeSubAcc = await this.twilioClient.api
        .accounts(sid)
        .update({ status: 'closed' });
      await this.twilioModel.findOneAndUpdate(
        { twilio_account_sid: sid },
        {
          $set: {
            status: closeSubAcc.status,
          },
        },
      );
      return { message: `Subaccount with SID ${sid} deleted successfully` };
    } catch (error) {
      throw new Error(`Failed to delete subaccount: ${error.message}`);
    }
  }

  async getPhoneNumbersForSubAccounts() {
    try {
      const subAccounts = await this.getAllSubAccounts();
      const phoneNumbers = await Promise.all(
        subAccounts.map(async (subAccount) => {
          const subAccountSid = subAccount.sid;
          const subAccountAuthToken = subAccount.authToken;
          console.log(
            'Fetching phone numbers for sub-account SID:',
            subAccountSid,
          );

          // Assuming each sub-account has its own auth token stored
          // const subAccountAuthToken =
          //   await this.getSubAccountAuthToken(subAccountSid);

          try {
            const subClient = new Twilio(subAccountSid, subAccountAuthToken);
            const numbers = await subClient.incomingPhoneNumbers.list();
            return {
              subAccountSid: subAccountSid,
              phoneNumbers: numbers.map((number) => number.phoneNumber),
            };
          } catch (innerError) {
            console.error(
              `Failed to fetch phone numbers for sub-account SID: ${subAccountSid}`,
              innerError,
            );
            return {
              subAccountSid: subAccountSid,
              phoneNumbers: [],
              error: innerError.message,
            };
          }
        }),
      );
      return phoneNumbers;
    } catch (error) {
      throw new Error(`Failed to fetch phone numbers: ${error.message}`);
    }
  }

  async getSubAccountAuthToken(subAccountSid: string): Promise<string> {
    return this.configService.get<string>('TWILIO_AUTH_TOKEN');
  }

  async fetchAvailableNumbers(
    countryCode: string,
    type: 'local' | 'tollFree',
    areaCode?: string,
    limit?: string,
  ): Promise<any> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const validCountryCodes = [
      'US',
      'CA',
      'GB',
      'AU',
      'DE',
      'FR',
      'ES',
      'IT',
      'IN',
      'JP',
      'CN',
      'MX',
      'BR',
      'ZA',
      'NZ',
    ];
    const validTypes = ['local', 'tollFree'];

    if (!validCountryCodes.includes(countryCode)) {
      throw new Error(
        `Invalid country code: ${countryCode}. Valid country codes are: ${validCountryCodes.join(', ')}`,
      );
    }

    if (!validTypes.includes(type)) {
      throw new Error(
        `Invalid type: ${type}. Valid types are: ${validTypes.join(', ')}`,
      );
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      throw new Error('Parameter limit must be a positive integer');
    }

    try {
      const listParams: { limit: number; areaCode?: string } = {
        limit: parsedLimit,
      };
      if (areaCode) {
        listParams.areaCode = areaCode;
      }
      const numbers = await (
        this.twilioClient.availablePhoneNumbers(countryCode)[type].list as any
      )(listParams);
      return numbers;
    } catch (error) {
      throw new Error(`Failed to fetch available numbers: ${error.message}`);
    }
  }

  async buyNumber(
    phoneNumber: string,
    subAccountSid: string,
    authToken: string,
  ): Promise<any> {
    try {
      const subAccountClient = new Twilio(subAccountSid, authToken);
      const purchasedNumber =
        await subAccountClient.incomingPhoneNumbers.create({ phoneNumber });
      return purchasedNumber;
    } catch (error) {
      throw new Error(`Failed to purchase number: ${error.message}`);
    }
  }

  async fetchPurchasedNumbers(
    subAccountSid: string,
    authToken: string,
  ): Promise<any> {
    try {
      const subAccountClient = new Twilio(subAccountSid, authToken);
      const numbers = await subAccountClient.incomingPhoneNumbers.list();
      return numbers;
    } catch (error) {
      throw new Error(`Failed to fetch purchased numbers: ${error.message}`);
    }
  }
  async fetchAllPurchasedNumbers(): Promise<any> {
    try {
      const parentAccountSid =
        this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const subAccounts = await this.twilioClient.api.accounts.list({
        limit: 100,
      });
      const allNumbers = [];

      for (const subAccount of subAccounts) {
        try {
          if (subAccount.ownerAccountSid === parentAccountSid) {
            const subAccountClient = new Twilio(
              subAccount.sid,
              subAccount.authToken,
            );
            const numbers = await subAccountClient.incomingPhoneNumbers.list();

            allNumbers.push(...numbers);
          }
        } catch (authError) {
          console.log(
            `Failed to fetch purchased numbers: ${authError.message}`,
          );
          continue;
        }
      }

      return allNumbers;
    } catch (error) {
      throw new Error(
        `Failed to fetch all purchased numbers: ${error.message}`,
      );
    }
  }
}
