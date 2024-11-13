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
import { UserInterface } from 'src/app/interface/user';

@Injectable()
export class MessagingTwilioService implements AbstractMessagingTwilioService {
  constructor(private readonly repository: AbstractMessagingTwilioRepository) {}

  async organization(
    req: UserInterface,
    organizationDTO: OrganizationDTO,
    friendlyName: string,
  ): Promise<any> {
    return await this.repository.organization(req, organizationDTO, friendlyName);
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

  async buyNumber(req: UserInterface,phoneNumber: string): Promise<any> {
    return await this.repository.buyNumber(req, phoneNumber);
  }

  async inbox(req: UserInterface,inbox: InboxesDTO): Promise<any> {
    return await this.repository.inbox(req, inbox);
  }
  async getAllOrganization(req: UserInterface,): Promise<any> {
    return await this.repository.getAllOrganization(req);
  }
  async getAllInbox(req: UserInterface,): Promise<any> {
    return await this.repository.getAllInbox(req);
  }

  async getInboxById(inbox_id: string): Promise<any> {
    return await this.repository.getInboxById(inbox_id);
  }

  async getOrganizationById(organization_id: string): Promise<any> {
    return await this.repository.getOrganizationById(organization_id);
  }

  async addMemberToAnOrganization(req: UserInterface,addMemberDTO: AddMemberDTO): Promise<any> {
    return await this.repository.addMemberToAnOrganization(req, addMemberDTO);
  }

  async getCred(password: string): Promise<any> {
    return await this.repository.getCred(password);
  }
  async getTwilioAccessToken(req: UserInterface,): Promise<any> {
    return await this.repository.getTwilioAccessToken(req);
  }
  async getPurchasedNumber(req: UserInterface,): Promise<any> {
    return await this.repository.getPurchasedNumber(req);
  }
  async activateWorkSpace(req: UserInterface,id: string): Promise<any> {
    return await this.repository.activateWorkSpace(req, id);
  }
  async activateInbox(req: UserInterface,id: string): Promise<any> {
    return await this.repository.activateInbox(req, id);
  }
  async getActivatedInbox(req: UserInterface,): Promise<any> {
    return await this.repository.getActivatedInbox(req);
  }
  async getActivatedWorkSpace(req: UserInterface,): Promise<any> {
    return await this.repository.getActivatedWorkSpace(req);
  }
}
