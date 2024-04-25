import { ContactsDTO } from 'src/app/dto/contacts';

export abstract class AbstractContactsService {
  abstract fileUpload(files: Files): Promise<any>;
  abstract createContacts(contactsDTO: ContactsDTO): Promise<any>;
}
export abstract class AbstractContactsRepository {
  abstract fileUpload(files: Files): Promise<any>;
  abstract createContacts(contactsDTO: ContactsDTO): Promise<any>;
}
interface File {
  path: string;
  filename: string;
  mimetype: string;
  created_at: string;
  file_id: any;
  extension: string;
}

export type Files = {
  image_1: File[];
  image_2: File[];
  image_3: File[];
  image_4: File[];
  image_5: File[];
};
