import mongoose, {
  Error,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  StreamableFile,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AbstractContactsRepository,
  Files,
  ExcelContactData,
} from 'src/app/interface/contacts';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/app/models/file-upload/file-upload.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/app/services/s3/s3.service';
import { ContactsDTO } from 'src/app/dto/contacts';
import {
  Contacts,
  ContactsDocument,
} from 'src/app/models/contacts/contacts.schema';
import * as XLSX from 'xlsx';
@Injectable()
export class ContactsRepository implements AbstractContactsRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private configService: ConfigService,
    private readonly s3: S3Service,
    @InjectModel(Contacts.name)
    private contactsModel: Model<ContactsDocument>,
  ) {}

  async fileUpload(files: Files): Promise<any | null> {
    const images: any = {};

    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });

    if (files === undefined)
      throw new BadRequestException('Image files cannot be empty.');

    if (files) {
      // s3 bucket upload and insertion in fileuploads collection
      const s3 = await this.UploadtoS3Bucket(files);

      for (const image of Object.keys(s3)) {
        images[image] = s3[image];
      }
    }

    const fileUpload = await this.fileUploadModel.create({
      user_id: userData._id,
      images: images,
    });
    if (!fileUpload) {
      throw new BadRequestException('Unable to upload files');
    }
  }

  private async UploadtoS3Bucket(files: any): Promise<any> {
    const domain = this.getDomainHost();
    const today = new Date();

    const uploadedFiles: any = {};

    for (const key of Object.keys(files)) {
      const file = files[key][0];

      if (!file) continue;

      const { originalname, mimetype, fieldname } = file;

      const s3Route = this.s3.defaultNonCatalogLineItemImagePath(originalname);
      const defaultPhotoPath = await this.s3.uploadImage(file, s3Route);
      console.log('defaultPhotoPath', defaultPhotoPath);

      if (!defaultPhotoPath)
        throw new InternalServerErrorException(
          'Unable to upload document to S3 Bucket',
        );

      const fileUpload = await this.fileUploadModel.create({
        original_filename: originalname,
        extension: originalname.split('.')[1],
        name: fieldname,
        mimetype: mimetype,
        path: defaultPhotoPath,
      });

      const fileInformation = {
        path: `${domain}/${defaultPhotoPath.replace(
          `/${originalname}`,
          '',
        )}?type=${file.fieldname}`,
        filename: originalname,
        mimetype: mimetype,
        created_at: today.toISOString(),
        file_id: fileUpload?._id,
        extension: fileUpload.extension,
      };

      uploadedFiles[key] = fileInformation;
    }

    return uploadedFiles;
  }

  private host =
    this.configService.get<string>('HOST') ||
    ('http://localhost:3000' as string);
  private getDomainHost(): string {
    return `${this.host}/api/servicehero/files`;
  }
  async createContacts(contactsDTO: ContactsDTO): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    return await this.contactsModel.create({
      user_id: userData._id,
      first_name: contactsDTO.first_name,
      last_name: contactsDTO.last_name,
      email: contactsDTO.email,
      phone_number: contactsDTO.phone_number,
      source: contactsDTO.source,
      lifetime_value: contactsDTO.lifetime_value,
      last_campaign_ran: contactsDTO.last_campaign_ran,
      last_interaction: contactsDTO.last_interaction,
    });
  }

  async importContacts(filePath: string): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ExcelContactData[] = XLSX.utils.sheet_to_json(sheet);

    // Process each row
    for (const item of data) {
      const contact = new this.contactsModel({
        user_id: userData._id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone_number: item.phone_number,
        source: item.source,
        lifetime_value: item.lifetime_value,
        last_campaign_ran: item.last_campaign_ran,
        last_interaction: new Date(item.last_interaction),
      });

      try {
        // Save the contact
        await contact.save();
      } catch (error) {
        // Handle duplicate emails or other errors
        console.error('Failed to import contact:', error);
      }
    }
  }
}
