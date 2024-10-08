import { Injectable } from '@nestjs/common';
import { Twilio, jwt } from 'twilio';
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
import {
  ActivatedTwilioInboxes,
  ActivatedTwilioInboxesDocument,
} from 'src/app/models/messaging-twilio/inboxes/activated-inboxes.schema';
import {
  ActivatedTwilioOrganizations,
  ActivatedTwilioOrganizationsDocument,
} from 'src/app/models/messaging-twilio/organization/activated-organization.schema';
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

    @InjectModel(ActivatedTwilioInboxes.name)
    private activatedTwilioInboxesModel: Model<ActivatedTwilioInboxesDocument>,
    @InjectModel(ActivatedTwilioOrganizations.name)
    private activatedTwilioOrganizationModel: Model<ActivatedTwilioOrganizationsDocument>,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }
  async organization(dto: OrganizationDTO, friendlyName: string): Promise<any> {
    try {
      const testOnly = this.configService.get<string>('SUBACCOUNT_NAME_PREFIX');
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
      } = await this.createSubAccount(`${testOnly} - ${dto.organization_name}`);

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
        twilio_chat_service_sid: encryptedChatServiceSid,
        twilio_api_key_sid: encryptedApiKeySid,
        twilio_api_key_secret: encryptedApiKeySecret,
        twilio_auth_token: encryptedAuthToken,
        status: OrganizationStatus.ACTIVE,
      });
      const result = await createOrganization.save();
      if (dto.users) {
        await this.userRepository.OrganizationInviteUser(dto);
      }

      return result;
    } catch (error) {
      throw new Error(`error: ${error.message}`);
    }
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
      // twilio_account_sid: decrypt(org.twilio_account_sid),
      // twilio_chat_service_sid: decrypt(org.twilio_chat_service_sid),
      // twilio_api_key_sid: decrypt(org.twilio_api_key_sid),
      // twilio_api_key_secret: decrypt(org.twilio_api_key_secret),
      // twilio_auth_token: decrypt(org.twilio_auth_token),
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
  async buyNumber(phoneNumber: string): Promise<any> {
    const activeOrganization = await this.getActivatedWorkSpace();
    const user = await this.userRepository.getLoggedInUserDetails();
    const organization = await this.twilioOrganizationModel.findOne({
      _id: activeOrganization._id,
    });

    if (!organization) {
      throw new Error(
        `Organization with the ID: ${activeOrganization._id} not found`,
      );
    }

    const decryptedSid = decrypt(organization.twilio_account_sid);
    const decryptedAuthToken = decrypt(organization.twilio_auth_token);

    const twilio_account_sid =
      process.env.TEST_TWILIO_ACCOUNT_SID || decryptedSid;

    const subAccount = await this.twilioClient.api
      .accounts(decryptedSid)
      .fetch();

    const twilio_auth_token =
      process.env.TEST_TWILIO_AUTH_TOKEN || subAccount.authToken;
    // Initialize a new Twilio client with the decrypted credentials
    const subAccountClient = new Twilio(twilio_account_sid, twilio_auth_token);

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
    const activeOrganization = await this.getActivatedWorkSpace();

    const user = await this.userRepository.getLoggedInUserDetails();
    const isExisting = await this.inboxModel.findOne({
      inbox_name: dto.inbox_name,
      created_by: user._id,
    });

    if (isExisting) {
      throw new Error(`${dto.inbox_name} is already existing`);
    }

    const isOrganizationIDValid = await this.twilioOrganizationModel.findOne({
      _id: new Types.ObjectId(activeOrganization._id),
    });

    if (!isOrganizationIDValid) {
      throw new Error(
        `organization with the ID: ${activeOrganization._id} not found`,
      );
    }

    const isNumberValid = await this.twilioNumberModel.findOne({
      purchased_number: dto.purchased_number,
    });

    if (!isNumberValid) {
      throw new Error(`this number: ${dto.purchased_number} is not valid`);
    }

    const createInbox = new this.inboxModel({
      inbox_name: dto.inbox_name,
      description: dto.description,
      organization_id: isOrganizationIDValid._id,
      purchased_number: dto.purchased_number,
      created_by: user._id,
      status: OrganizationStatus.ACTIVE,
    });

    const assigningOfNumber = await this.twilioNumberModel.findOneAndUpdate(
      { purchased_number: dto.purchased_number },
      { $set: { inbox_assinged_To: createInbox._id } },
    );

    return await createInbox.save();
  }

  async getInboxById(inbox_id: string): Promise<any> {
    const result = await this.inboxModel.findOne({
      _id: new Types.ObjectId(inbox_id),
    });

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
    // result.twilio_account_sid = decrypt(result.twilio_account_sid);
    // result.twilio_chat_service_sid = decrypt(result.twilio_chat_service_sid);
    // result.twilio_api_key_sid = decrypt(result.twilio_api_key_sid);
    // result.twilio_api_key_secret = decrypt(result.twilio_api_key_secret);
    // result.twilio_auth_token = decrypt(result.twilio_auth_token);
    return result;
  }

  async getAllInbox() {
    const activeOrganization = await this.getActivatedWorkSpace();
    const result = await this.inboxModel.find({
      organization_id: activeOrganization._id,
    });
    return result;
  }

  async addMemberToAnOrganization(addMemberDTO: AddMemberDTO): Promise<any> {
    const activeOrganization = await this.getActivatedWorkSpace();

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
      { _id: activeOrganization._id },
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

  async getTwilioAccessToken() {
    const activeOrganization = await this.getActivatedWorkSpace();
    const testAccountSid = this.configService.get<string>(
      'TEST_CONVO_TWILIO_ACCOUNT_SID',
    );
    const testApiKey = this.configService.get<string>(
      'TEST_CONVO_TWILIO_API_KEY',
    );
    const testApiSecret = this.configService.get<string>(
      'TEST_CONVO_TWILIO_API_SECRET',
    );
    const testServiceSid = this.configService.get<string>(
      'TEST_CONVO_TWILIO_SERVICE_SID',
    );

    const user = await this.userRepository.getLoggedInUserDetails();
    const twilioCred = await this.twilioOrganizationModel.findOne({
      _id: activeOrganization._id,
      created_by: user._id,
    });
    if (!twilioCred) {
      throw new Error(
        `organization with the ID: ${activeOrganization._id} not found `,
      );
    }
    const AccessToken = jwt.AccessToken;
    const ChatGrant = AccessToken.ChatGrant;
    const twilioAccountSid =
      testAccountSid || decrypt(twilioCred.twilio_account_sid);
    const twilioApiKey = testApiKey || decrypt(twilioCred.twilio_api_key_sid);
    const twilioApiSecret =
      testApiSecret || decrypt(twilioCred.twilio_api_key_secret);

    const serviceSid =
      testServiceSid || decrypt(twilioCred.twilio_chat_service_sid);
    // const identity = user.email;
    const chatGrant = new ChatGrant({
      serviceSid: serviceSid,
    });
    const activeInbox = await this.getActivatedInbox();
    const userEmail = user.email;
    const inboxId = activeInbox._id.toString();
    const identity = `${userEmail}-${inboxId}`;
    console.log('identity:', identity);
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity, ttl: 43200 },
    );

    token.addGrant(chatGrant);
    return token.toJwt();
  }

  async getPurchasedNumber(): Promise<any> {
    const activeOrganization = await this.getActivatedWorkSpace();
    return await this.twilioNumberModel.find({
      organization_id: activeOrganization._id,
    });
  }

  async activateWorkSpace(id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validWorkSpace = await this.twilioOrganizationModel.findById(
      new Types.ObjectId(id),
    );
    if (!validWorkSpace) {
      throw new Error(`organization with the ID: ${id} not found `);
    }
    const isExisting = await this.activatedTwilioOrganizationModel.findOne({
      organization_id: validWorkSpace._id,
      activated_by: user._id,
    });
    let result: {};
    if (isExisting) {
      await this.activatedTwilioOrganizationModel.updateMany(
        {
          activated_by: user._id,
        },
        {
          $set: {
            status: OrganizationStatus.INACTIVE,
          },
        },
      );
      result = await this.activatedTwilioOrganizationModel.findOneAndUpdate(
        {
          organization_id: validWorkSpace._id,
          activated_by: user._id,
        },
        {
          $set: {
            organization_id: new Types.ObjectId(id),
            activated_by: user._id,
            status: OrganizationStatus.ACTIVE,
          },
        },
        {
          new: true,
        },
      );
    } else {
      await this.activatedTwilioOrganizationModel.updateMany(
        {
          activated_by: user._id,
        },
        {
          $set: {
            status: OrganizationStatus.INACTIVE,
          },
        },
      );

      const activateOrganization = new this.activatedTwilioOrganizationModel({
        organization_id: new Types.ObjectId(id),
        activated_by: user._id,
        status: OrganizationStatus.ACTIVE,
      });
      result = await activateOrganization.save();
    }
    return result;
  }
  async activateInbox(id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validWorkSpace = await this.inboxModel.findById(
      new Types.ObjectId(id),
    );
    if (!validWorkSpace) {
      throw new Error(`inbox with the ID: ${id} not found `);
    }
    const isExisting = await this.activatedTwilioInboxesModel.findOne({
      inbox_id: validWorkSpace._id,
      activated_by: user._id,
    });
    let result: {};
    if (isExisting) {
      await this.activatedTwilioInboxesModel.updateMany(
        {
          activated_by: user._id,
        },
        {
          $set: {
            status: OrganizationStatus.INACTIVE,
          },
        },
      );
      result = await this.activatedTwilioInboxesModel.findOneAndUpdate(
        {
          inbox_id: validWorkSpace._id,
          activated_by: user._id,
        },
        {
          $set: {
            inbox_id: new Types.ObjectId(id),
            activated_by: user._id,
            status: OrganizationStatus.ACTIVE,
          },
        },
      );
    } else {
      await this.activatedTwilioInboxesModel.updateMany(
        {
          activated_by: user._id,
        },
        {
          $set: {
            status: OrganizationStatus.INACTIVE,
          },
        },
      );

      const activateInbox = new this.activatedTwilioInboxesModel({
        inbox_id: new Types.ObjectId(id),
        activated_by: user._id,
        status: OrganizationStatus.ACTIVE,
      });
      result = await activateInbox.save();
    }
    return result;
  }
  async getActivatedInbox(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const activeWorkSpace = await this.getActivatedWorkSpace();
    const activeInbox = await this.inboxModel.findOne({
      organization_id: activeWorkSpace._id,
    });
    if (activeInbox) {
      const data = await this.activatedTwilioInboxesModel.findOne({
        inbox_id: activeInbox?._id,
        status: OrganizationStatus.ACTIVE,
      });
      if (data) {
        return await this.inboxModel.findById(data.inbox_id);
      } else {
        const result = await this.inboxModel.find({ created_by: user._id });
        if (result) {
          return result[0];
        } else {
          throw new Error(`No Inbox found`);
        }
      }
    }
    throw new Error(`No Inbox found`);
  }
  async getActivatedWorkSpace(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const data = await this.activatedTwilioOrganizationModel.findOne({
      activated_by: user._id,
      status: OrganizationStatus.ACTIVE,
    });
    if (data) {
      let result = await this.twilioOrganizationModel.findById(
        data.organization_id,
      );
      return {
        _id: result._id,
        organization_name: result.organization_name,
        description: result.description,
        created_by: result.created_by,
        status: result.status,
      };
    }
    return {};
  }
}
