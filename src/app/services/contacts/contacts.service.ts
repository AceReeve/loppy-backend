import { Injectable } from '@nestjs/common';
import { ContactsDTO } from 'src/app/dto/contacts';
import { PaginateResponse } from 'src/app/interface';
import {
  AbstractContactsRepository,
  AbstractContactsService,
  Files,
} from 'src/app/interface/contacts';
import { ContactsDocument } from 'src/app/models/contacts/contacts.schema';

@Injectable()
export class ContactsService implements AbstractContactsService {
  constructor(
    private readonly abstractContactsRepository: AbstractContactsRepository,
  ) {}

  async contactList(): Promise<any> {
    return this.abstractContactsRepository.contactList();
  }

  async createContacts(contactsDTO: ContactsDTO): Promise<any> {
    return this.abstractContactsRepository.createContacts(contactsDTO);
  }
  async editContacts(contactsDTO: ContactsDTO, id: string): Promise<any> {
    return this.abstractContactsRepository.editContacts(contactsDTO, id);
  }
  async removeContacts(id: string): Promise<any> {
    return this.abstractContactsRepository.removeContacts(id);
  }

  async importContacts(filePath: string): Promise<any> {
    return this.abstractContactsRepository.importContacts(filePath);
  }

  async getAllContacts(
    searchKey?: string,
    status?: string,
    skip = 1,
    limit = 10,
    sort_dir?: string,
    tags?: string | string[],
  ): Promise<PaginateResponse<ContactsDocument>> {
    return await this.abstractContactsRepository.getAllContacts(
      searchKey,
      status,
      skip,
      limit,
      sort_dir,
      tags,
    );
  }
  async exportContacts(
    fromDate?: Date,
    toDate?: Date,
    all?: Boolean,
  ): Promise<Buffer> {
    return await this.abstractContactsRepository.exportContacts(
      fromDate,
      toDate,
      all,
    );
  }

  async getContactByID(id: string): Promise<any> {
    return await this.abstractContactsRepository.getContactByID(id);
  }
}
