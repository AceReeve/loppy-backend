import { Inject, Injectable } from '@nestjs/common';
import {
  AddMemberDTO,
  InboxesDTO,
  OrganizationDTO,
} from 'src/app/dto/messaging-twilio';
import {
  AbstractMessagingTwilioRepository,
  AbstractMessagingTwilioService,
} from 'src/app/interface/messaging-twilio';

@Injectable()
export class MessagingTwilioService implements AbstractMessagingTwilioService {
  constructor(private readonly repository: AbstractMessagingTwilioRepository) {}

  async organization(
    organizationDTO: OrganizationDTO,
    friendlyName: string,
  ): Promise<any> {
    return await this.repository.organization(organizationDTO, friendlyName);
  }

  async fetchAvailableNumbers(
    countryCode: string,
    type: string,
    areaCode: string,
    limit: string,
  ): Promise<any> {
    return await this.repository.fetchAvailableNumbers(
      countryCode,
      type,
      areaCode,
      limit,
    );
  }

  async buyNumber(phoneNumber: string, organization_id): Promise<any> {
    return await this.repository.buyNumber(phoneNumber, organization_id);
  }

  async inbox(inbox: InboxesDTO): Promise<any> {
    return await this.repository.inbox(inbox);
  }
  async getAllOrganization(): Promise<any> {
    return await this.repository.getAllOrganization();
  }
  async getAllInbox(organization_id: string): Promise<any> {
    return await this.repository.getAllInbox(organization_id);
  }

  async getInboxById(inbox_id: string): Promise<any> {
    return await this.repository.getInboxById(inbox_id);
  }

  async getOrganizationById(organization_id: string): Promise<any> {
    return await this.repository.getOrganizationById(organization_id);
  }

  async addMemberToAnOrganization(
    organization_id: string,
    addMemberDTO: AddMemberDTO,
  ): Promise<any> {
    return await this.repository.addMemberToAnOrganization(
      organization_id,
      addMemberDTO,
    );
  }

  async getCred(password: string): Promise<any> {
    return await this.repository.getCred(password);
  }
  async getTwilioAccessToken(id: string): Promise<any> {
    return await this.repository.getTwilioAccessToken(id);
  }
  async getPurchasedNumber(id: string): Promise<any> {
    return await this.repository.getPurchasedNumber(id);
  }
}
