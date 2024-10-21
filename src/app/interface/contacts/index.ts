import { ContactsDTO } from 'src/app/dto/contacts';

export abstract class AbstractContactsService {
  abstract createContacts(contactsDTO: ContactsDTO): Promise<any>;
  abstract editContacts(contactsDTO: ContactsDTO, id: string): Promise<any>;
  abstract removeContacts(id: string): Promise<any>;
  abstract importContacts(filePath: string): Promise<any>;
  abstract getAllContacts(
    searchKey?: string,
    status?: string,
    skip?: number,
    limit?: number,
    sort_dir?: string,
    tags?: string | string[],
  ): Promise<any>;
  abstract getAllContact(): Promise<any>;
  abstract getContactByID(id: string): Promise<any>;
  abstract contactList(): Promise<any>;
  abstract exportContacts(
    fromDate: Date,
    toDate: Date,
    all: Boolean,
  ): Promise<any>;
}
export abstract class AbstractContactsRepository {
  abstract contactList(): Promise<any>;
  abstract createContacts(contactsDTO: ContactsDTO): Promise<any>;
  abstract removeContacts(id: string): Promise<any>;
  abstract editContacts(contactsDTO: ContactsDTO, id: string): Promise<any>;
  abstract importContacts(filePath: string): Promise<any>;
  abstract getAllContacts(
    searchKey?: string,
    status?: string,
    skip?: number,
    limit?: number,
    sort_dir?: string,
    tags?: string | string[],
  ): Promise<any>;
  abstract getAllContact(): Promise<any>;
  abstract getContactByID(id: string): Promise<any>;
  abstract exportContacts(
    fromDate: Date,
    toDate: Date,
    all: Boolean,
  ): Promise<any>;
}
export interface ExcelContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  source: string;
  // lifetime_value: number;
  last_campaign_ran: string;
  last_interaction: string;
  tags: string;
}
