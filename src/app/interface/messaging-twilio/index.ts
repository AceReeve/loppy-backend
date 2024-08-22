import { AddMemberDTO, InboxesDTO, OrganizationDTO } from 'src/app/dto/messaging-twilio';

export abstract class AbstractMessagingTwilioRepository {
  abstract organization(organizationDTO: OrganizationDTO, friendlyName: string): Promise<any>;
  abstract getAllOrganization(): Promise<any>;
  abstract fetchAvailableNumbers(
    countryCode: string,
    type: string,
    areaCode: string,
    limit: string,
  ): Promise<any>;

  abstract buyNumber(
    phoneNumber: string,
    organization_id: string,
  ): Promise<any>;

  abstract inbox(inbox: InboxesDTO): Promise<any>;
  abstract getInboxById(inbox_id: string): Promise<any>;
  abstract getOrganizationById(organization_id: string): Promise<any>;
  abstract getAllInbox(organization_id: string): Promise<any>;
  abstract addMemberToAnOrganization(organization_id: string, addMemberDTO: AddMemberDTO): Promise<any>;
}

export abstract class AbstractMessagingTwilioService {
  abstract organization(organizationDTO: OrganizationDTO, friendlyName: string): Promise<any>;
  abstract getAllOrganization(): Promise<any>;
  abstract fetchAvailableNumbers(
    countryCode: string,
    type: string,
    areaCode: string,
    limit: string,
  ): Promise<any>;

  abstract buyNumber(
    phoneNumber: string,
    organization_id: string,
  ): Promise<any>;

  abstract inbox(inbox: InboxesDTO): Promise<any>;
  abstract getInboxById(inbox_id: string): Promise<any>;
  abstract getOrganizationById(organization_id: string): Promise<any>;
  abstract getAllInbox(organization_id: string): Promise<any>;
  abstract addMemberToAnOrganization(organization_id: string, addMemberDTO: AddMemberDTO): Promise<any>;

}
