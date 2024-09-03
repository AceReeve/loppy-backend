import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { AbstractMessagingTwilioRepository } from 'src/app/interface/messaging-twilio';
import {
  AddMemberDTO,
  InboxesDTO,
  OrganizationDTO,
} from 'src/app/dto/messaging-twilio';
import {
  TwilioOrganizations,
  TwilioOrganizationsDocument,
} from 'src/app/models/messaging-twilio/organization/organization.schema';
import { UserRepository } from '../user/user.repository';
import { OrganizationStatus } from 'src/app/const';
import {
  TwilioInboxes,
  TwilioInboxesDocument,
} from 'src/app/models/messaging-twilio/inboxes/inboxes.schema';
import {
  TwilioNumber,
  TwilioNumberDocument,
} from 'src/app/models/messaging-twilio/purchase-number/twilio-number.schema';
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
export class MessagingTwilioRepository
  implements AbstractMessagingTwilioRepository
{
  private twilioClient: Twilio;
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
    @InjectModel(TwilioOrganizations.name)
    private twilioOrganizationModel: Model<TwilioOrganizationsDocument>,
    @InjectModel(TwilioInboxes.name)
    private inboxModel: Model<TwilioInboxesDocument>,
    @InjectModel(TwilioNumber.name)
    private twilioNumberModel: Model<TwilioNumberDocument>,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }
  async organization(dto: OrganizationDTO, friendlyName: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const isExisting = await this.twilioOrganizationModel.findOne({
      organization_name: dto.organization_name,
      created_by: user._id,
    });
    if (isExisting) {
      throw new Error(`${dto.organization_name} is already existing`);
    }
    const {
      TWILIO_ACCOUNT_SID: accountSid,
      TWILIO_AUTH_TOKEN: authToken,
      TWILIO_API_KEY_SID: apiKeySid,
      TWILIO_API_KEY_SECRET: apiKeySecret,
      TWILIO_CHAT_SERVICE_SID: chatServiceSid,
    } = await this.createSubAccount(friendlyName);

    console.log(
      'TWILIO_ACCOUNT_SID:',
      accountSid,
      'TWILIO_AUTH_TOKEN:',
      authToken,
      'TWILIO_API_KEY_SID:',
      apiKeySid,
      'TWILIO_API_KEY_SECRET:',
      apiKeySecret,
      'TWILIO_CHAT_SERVICE_SID:',
      chatServiceSid,
    );
    const encryptedAccountSid = encrypt(accountSid);
    const encryptedAuthToken = encrypt(authToken);
    const encryptedApiKeySid = encrypt(apiKeySid);
    const encryptedApiKeySecret = encrypt(apiKeySecret);
    const encryptedChatServiceSid = encrypt(chatServiceSid);

    const createOrganization = new this.twilioOrganizationModel({
      organization_name: dto.organization_name,
      description: dto.description,
      created_by: user._id,
      twilio_account_sid: encryptedAccountSid,
      twilio_chat_service_sid: encryptedAuthToken,
      twilio_api_key_sid: encryptedApiKeySid,
      twilio_api_key_secret: encryptedApiKeySecret,
      twilio_auth_token: encryptedChatServiceSid,
      status: OrganizationStatus.ACTIVE,
    });
    return await createOrganization.save();
  }

  async createSubAccount(friendlyName: string): Promise<any> {
    try {
      // Create the subaccount
      const subAccount = await this.twilioClient.api.accounts.create({
        friendlyName,
      });
      // Initialize Twilio client for the subaccount
      const subAccountClient = new Twilio(subAccount.sid, subAccount.authToken);
      // Create an API Key for the subaccount
      const apiKey = await subAccountClient.newKeys.create();
      // Create a Chat Service for the subaccount
      const chatService = await subAccountClient.chat.v2.services.create({
        friendlyName: `${friendlyName} Chat Service`,
      });
      return {
        TWILIO_ACCOUNT_SID: subAccount.sid,
        TWILIO_AUTH_TOKEN: subAccount.authToken,
        TWILIO_API_KEY_SID: apiKey.sid,
        TWILIO_API_KEY_SECRET: apiKey.secret,
        TWILIO_CHAT_SERVICE_SID: chatService.sid,
      };
    } catch (error) {
      throw new Error(`Failed to create subaccount: ${error.message}`);
    }
  }

  async getAllOrganization() {
    const user = await this.userRepository.getLoggedInUserDetails();
    const organizations = await this.twilioOrganizationModel.find({
      created_by: user._id,
    });
    const result = organizations.map((org) => ({
      _id: org._id,
      organization_name: org.organization_name,
      description: org.description,
      created_by: org.created_by,
      twilio_account_sid: decrypt(org.twilio_account_sid),
      twilio_chat_service_sid: decrypt(org.twilio_chat_service_sid),
      twilio_api_key_sid: decrypt(org.twilio_api_key_sid),
      twilio_api_key_secret: decrypt(org.twilio_api_key_secret),
      twilio_auth_token: decrypt(org.twilio_auth_token),
      status: org.status,
    }));

    return result;
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

  // async buyNumber(phoneNumber: string, organization_id: string): Promise<any> {
  //   try {
  //     const user = await this.userRepository.getLoggedInUserDetails();
  //     const organization = await this.twilioOrganizationModel.findOne({
  //       _id: new Types.ObjectId(organization_id),
  //     });

  //     if (!organization) {
  //       throw new Error(`Organization with the ID: ${organization_id} not found`);
  //     }

  //     const twilio_account_sid = decrypt(organization.twilio_account_sid);
  //     const twilio_auth_token = decrypt(organization.twilio_auth_token);
  //     console.log('Decrypted Twilio Account SID:', twilio_account_sid);
  //     console.log('Decrypted Twilio Auth Token:', twilio_auth_token);

  //     const subAccountClient = new Twilio(twilio_account_sid, twilio_auth_token);

  //     try {
  //       console.log('1')

  //       const purchasedNumber = await subAccountClient.incomingPhoneNumbers.create({ phoneNumber });
  //       console.log('purchasedNumber',purchasedNumber)
  //       const purchaseNumber = new this.twilioNumberModel({
  //         purchased_number: purchasedNumber.phoneNumber,
  //         organization_id: organization._id,
  //         created_by: user._id,
  //         status: OrganizationStatus.ACTIVE,
  //       });

  //       return await purchaseNumber.save();
  //     } catch (twilioError) {
  //       console.error('Twilio API Error:', twilioError);
  //       throw new Error(`Failed to purchase number from Twilio: ${twilioError.message}`);
  //     }

  //   } catch (error) {
  //     console.error('Error in buyNumber function:', error);
  //     throw new Error(`Failed to purchase number: ${error.message}`);
  //   }
  // }

  async buyNumber(phoneNumber: string, organization_id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const organization = await this.twilioOrganizationModel.findOne({
      _id: new Types.ObjectId(organization_id),
    });

    if (!organization) {
      throw new Error(`Organization with the ID: ${organization_id} not found`);
    }

    const twilio_account_sid = decrypt(organization.twilio_account_sid);
    const twilio_auth_token = decrypt(organization.twilio_auth_token);
    const subAccount = await this.twilioClient.api
      .accounts(twilio_account_sid)
      .fetch();
    // Initialize a new Twilio client with the decrypted credentials
    const subAccountClient = new Twilio(
      twilio_account_sid,
      subAccount.authToken,
    );

    try {
      const purchasedNumber =
        await subAccountClient.incomingPhoneNumbers.create({ phoneNumber });

      const purchaseNumber = new this.twilioNumberModel({
        purchased_number: purchasedNumber.phoneNumber,
        organization_id: organization._id,
        created_by: user._id,
        status: OrganizationStatus.ACTIVE,
      });
      return await purchaseNumber.save();
    } catch (twilioError) {
      console.error('Twilio API Error:', twilioError);
      throw new Error(
        `Failed to purchase number from Twilio: ${twilioError.message}`,
      );
    }
  }

  async inbox(dto: InboxesDTO): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    console.log('1');
    const isExisting = await this.inboxModel.findOne({
      inbox_name: dto.inbox_name,
      created_by: user._id,
    });
    console.log('2');

    if (isExisting) {
      throw new Error(`${dto.inbox_name} is already existing`);
    }
    console.log('3');

    const isOrganizationIDValid = await this.twilioOrganizationModel.findOne({
      _id: new Types.ObjectId(dto.organization_id),
    });
    console.log('4');

    if (!isOrganizationIDValid) {
      throw new Error(
        `organization with the ID: ${dto.organization_id} not found`,
      );
    }
    console.log('5');

    const isNumberValid = await this.twilioNumberModel.findOne({
      purchased_number: dto.purchased_number,
    });
    console.log('6');

    if (!isNumberValid) {
      throw new Error(`this number: ${dto.purchased_number} is not valid`);
    }
    console.log('7');

    const createInbox = new this.inboxModel({
      inbox_name: dto.inbox_name,
      description: dto.description,
      organization_id: isOrganizationIDValid._id,
      purchased_number: dto.purchased_number,
      created_by: user._id,
      status: OrganizationStatus.ACTIVE,
    });
    console.log('8');

    const assigningOfNumber = await this.twilioNumberModel.findOneAndUpdate(
      { purchased_number: dto.purchased_number },
      { $set: { inbox_assinged_To: createInbox._id } },
    );
    console.log('9');

    return await createInbox.save();
  }

  async getInboxById(inbox_id: string): Promise<any> {
    console.log('inbox_id', inbox_id);
    const result = await this.inboxModel.findOne({
      _id: new Types.ObjectId(inbox_id),
    });
    console.log('result', result);

    if (!result) {
      throw new Error(`inbox with the ID: ${inbox_id} not found `);
    }
    return result;
  }
  async getOrganizationById(organization_id: string): Promise<any> {
    const result = await this.twilioOrganizationModel.findOne({
      _id: new Types.ObjectId(organization_id),
    });
    if (!result) {
      throw new Error(
        `organization with the ID: ${organization_id} not found `,
      );
    }
    result.twilio_account_sid = decrypt(result.twilio_account_sid);
    result.twilio_chat_service_sid = decrypt(result.twilio_chat_service_sid);
    result.twilio_api_key_sid = decrypt(result.twilio_api_key_sid);
    result.twilio_api_key_secret = decrypt(result.twilio_api_key_secret);
    result.twilio_auth_token = decrypt(result.twilio_auth_token);
    return result;
  }

  async getAllInbox(organization_id: string) {
    const result = await this.inboxModel.find({
      organization_id: new Types.ObjectId(organization_id),
    });
    return result;
  }

  async addMemberToAnOrganization(
    organization_id: string,
    addMemberDTO: AddMemberDTO,
  ): Promise<any> {
    const { members } = addMemberDTO;

    // Fetch existing members in the organization
    const memberData = await this.userRepository.getMember();

    // Filter out user IDs that are not in the fetched member data
    const validMembers = members.filter((member) =>
      memberData.users.some((user) => user.user_id === member.user_id),
    );

    if (validMembers.length === 0) {
      throw new Error('None of the provided user IDs are valid.');
    }

    // Update the organization with the valid members
    const updatedOrganization = await this.inboxModel.findOneAndUpdate(
      { _id: new Types.ObjectId(organization_id) },
      {
        $push: { members: { $each: validMembers } },
      },
      { new: true },
    );

    return updatedOrganization;
  }

  async getCred(password: string): Promise<any> {
    if (password !== 'Dev2024') {
      throw new Error('Wrong Password');
    }
    const sid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const service_sid = this.configService.get<string>(
      'TWILIO_CHAT_SERVICE_SID',
    );
    const secret = this.configService.get<string>('TWILIO_API_KEY_SECRET');

    return { sid: sid, token: token, service_sid: service_sid, secret: secret };
  }
}
