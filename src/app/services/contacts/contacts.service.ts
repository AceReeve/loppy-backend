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

  async fileUpload(files: Files): Promise<any> {
    return this.abstractContactsRepository.fileUpload(files);
  }

  async createContacts(contactsDTO: ContactsDTO): Promise<any> {
    return this.abstractContactsRepository.createContacts(contactsDTO);
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

  async getContactByID(id: string): Promise<any> {
    return await this.abstractContactsRepository.getContactByID(id);
  }
}
