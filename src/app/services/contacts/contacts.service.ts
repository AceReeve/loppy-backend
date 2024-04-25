import { Injectable } from '@nestjs/common';
import { ContactsDTO } from 'src/app/dto/contacts';
import {
  AbstractContactsRepository,
  AbstractContactsService,
  Files,
} from 'src/app/interface/contacts';

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
}
