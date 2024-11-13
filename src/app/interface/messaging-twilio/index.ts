import {
  AddMemberDTO,
  InboxesDTO,
  OrganizationDTO,
} from 'src/app/dto/messaging-twilio';
import { UserInterface } from '../user';

export abstract class AbstractMessagingTwilioRepository {
  abstract organization(
    req: UserInterface,
    organizationDTO: OrganizationDTO,
    friendlyName: string,
  ): Promise<any>;
  abstract getAllOrganization(req: UserInterface): Promise<any>;
  abstract fetchAvailableNumbers(
    countryCode: string,
    type: string,
    areaCode: string,
    limit: string,
  ): Promise<any>;

  abstract buyNumber(req: UserInterface,phoneNumber: string): Promise<any>;

  abstract inbox(req: UserInterface,inbox: InboxesDTO): Promise<any>;
  abstract getInboxById(inbox_id: string): Promise<any>;
  abstract getOrganizationById(id: string): Promise<any>;
  abstract getAllInbox(req: UserInterface,): Promise<any>;
  abstract addMemberToAnOrganization(req: UserInterface,addMemberDTO: AddMemberDTO): Promise<any>;
  abstract getCred(password: string): Promise<any>;
  abstract getTwilioAccessToken(req: UserInterface,): Promise<any>;
  abstract getPurchasedNumber(req: UserInterface,): Promise<any>;
  abstract activateWorkSpace(req: UserInterface,id: string): Promise<any>;
  abstract activateInbox(req: UserInterface,id: string): Promise<any>;
  abstract getActivatedInbox(req: UserInterface,): Promise<any>;
  abstract getActivatedWorkSpace(req: UserInterface,): Promise<any>;
}

export abstract class AbstractMessagingTwilioService {
  abstract organization(
    req: UserInterface,
    organizationDTO: OrganizationDTO,
    friendlyName: string,
  ): Promise<any>;
  abstract getAllOrganization(req: UserInterface): Promise<any>;
  abstract fetchAvailableNumbers(
    countryCode: string,
    type: string,
    areaCode: string,
    limit: string,
  ): Promise<any>;

  abstract buyNumber(req: UserInterface,phoneNumber: string): Promise<any>;

  abstract inbox(req: UserInterface,inbox: InboxesDTO): Promise<any>;
  abstract getInboxById(inbox_id: string): Promise<any>;
  abstract getOrganizationById(id: string): Promise<any>;
  abstract getAllInbox(req: UserInterface,): Promise<any>;
  abstract addMemberToAnOrganization(req: UserInterface,addMemberDTO: AddMemberDTO): Promise<any>;
  abstract getCred(password: string): Promise<any>;
  abstract getTwilioAccessToken(req: UserInterface,): Promise<any>;
  abstract getPurchasedNumber(req: UserInterface,): Promise<any>;
  abstract activateWorkSpace(req: UserInterface,id: string): Promise<any>;
  abstract activateInbox(req: UserInterface,id: string): Promise<any>;
  abstract getActivatedInbox(req: UserInterface,): Promise<any>;
  abstract getActivatedWorkSpace(req: UserInterface,): Promise<any>;
}
