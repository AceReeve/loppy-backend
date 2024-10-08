import { Inject, Injectable } from '@nestjs/common';
import {
  AbstractMessagingTwilioRepository,
  AbstractMessagingTwilioService,
} from 'src/app/interface/messaging-twilio';

import {
  AddMemberDTO,
  InboxesDTO,
  OrganizationDTO,
} from 'src/app/dto/messaging-twilio';

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

  async buyNumber(phoneNumber: string): Promise<any> {
    return await this.repository.buyNumber(phoneNumber);
  }

  async inbox(inbox: InboxesDTO): Promise<any> {
    return await this.repository.inbox(inbox);
  }
  async getAllOrganization(): Promise<any> {
    return await this.repository.getAllOrganization();
  }
  async getAllInbox(): Promise<any> {
    return await this.repository.getAllInbox();
  }

  async getInboxById(inbox_id: string): Promise<any> {
    return await this.repository.getInboxById(inbox_id);
  }

  async getOrganizationById(organization_id: string): Promise<any> {
    return await this.repository.getOrganizationById(organization_id);
  }

  async addMemberToAnOrganization(addMemberDTO: AddMemberDTO): Promise<any> {
    return await this.repository.addMemberToAnOrganization(addMemberDTO);
  }

  async getCred(password: string): Promise<any> {
    return await this.repository.getCred(password);
  }
  async getTwilioAccessToken(): Promise<any> {
    return await this.repository.getTwilioAccessToken();
  }
  async getPurchasedNumber(): Promise<any> {
    return await this.repository.getPurchasedNumber();
  }
  async activateWorkSpace(id: string): Promise<any> {
    return await this.repository.activateWorkSpace(id);
  }
  async activateInbox(id: string): Promise<any> {
    return await this.repository.activateInbox(id);
  }
  async getActivatedInbox(): Promise<any> {
    return await this.repository.getActivatedInbox();
  }
  async getActivatedWorkSpace(): Promise<any> {
    return await this.repository.getActivatedWorkSpace();
  }
}
