import mongoose, {
  Error,
  FilterQuery,
  Model,
  Mongoose,
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
import { IPaginationMeta } from 'src/app/interface';
import {
  ContactsHistory,
  ContactsHistoryDocument,
} from 'src/app/models/contacts/contacts-history.schema';
import { ContactStatus } from 'src/app/const';
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
    @InjectModel(ContactsHistory.name)
    private contactsHistoryModel: Model<ContactsHistoryDocument>,
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
      tags: contactsDTO.tags,
    });
  }

  async editContacts(contactsDTO: ContactsDTO, id: string): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const updateContact = await this.contactsModel.findOneAndUpdate(
      { _id: id, user_id: userData._id },
      {
        user_id: userData._id,
        first_name: contactsDTO.first_name,
        last_name: contactsDTO.last_name,
        email: contactsDTO.email,
        phone_number: contactsDTO.phone_number,
        source: contactsDTO.source,
        lifetime_value: contactsDTO.lifetime_value,
        last_campaign_ran: contactsDTO.last_campaign_ran,
        last_interaction: contactsDTO.last_interaction,
        tags: contactsDTO.tags,
      },
    );
    if (!updateContact) {
      throw new BadRequestException('Contact Not Found');
    }

    return await this.contactsModel.findById(updateContact._id);
  }

  async removeContacts(id: string): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const updateContact = await this.contactsModel.findOneAndUpdate(
      { _id: id, user_id: userData._id },
      {
        status: ContactStatus.INACTIVE,
      },
    );
    if (!updateContact) {
      throw new BadRequestException('Contact Not Found');
    }

    return await this.contactsModel.findById(updateContact._id);
  }
  async importContacts(filePath: string): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ExcelContactData[] = XLSX.utils.sheet_to_json(sheet);

    // Track rows that already exist
    const existingContacts: ExcelContactData[] = [];
    const importedContacts: any[] = [];
    const historyEntries: any[] = [];

    // Process each row
    for (const item of data) {
      const existingContact = await this.contactsModel.findOne({
        user_id: userData._id,
        $or: [{ email: item.email }, { phone_number: item.phone_number }],
      });
      if (existingContact) {
        existingContacts.push(item);
      } else {
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
          await contact.save();
          importedContacts.push(contact);
          // Create a history entry for this contact
          historyEntries.push({
            date: new Date(),
            contact_id: contact._id,
          });
        } catch (error) {
          throw new BadRequestException('Failed to import contact');
        }
      }
    }
    // Save all history entries in one document
    if (historyEntries.length > 0) {
      const historyEntry = new this.contactsHistoryModel({
        user_id: userData._id,
        type: 'imported',
        history: historyEntries,
      });

      try {
        await historyEntry.save();
      } catch (error) {
        throw new BadRequestException('Failed to save contact history');
      }
    }

    if (existingContacts.length > 0) {
      const existingDetails = existingContacts
        .map(
          (contact) =>
            `Email: ${contact.email}, Phone: ${contact.phone_number}`,
        )
        .join(', ');
      throw new BadRequestException(
        `Contacts with the following details already exist and were not saved: ${existingDetails}`,
      );
    }

    return { message: 'All Contacts imported successfully' };
  }

  async exportContacts(from?: Date, to?: Date, all?: Boolean): Promise<Buffer> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    if (!userData) {
      throw new BadRequestException('User not found');
    }

    let query: any = { user_id: userData._id };
    if (from && to && all !== true) {
      const fromStartOfDay = new Date(from);
      fromStartOfDay.setUTCHours(0, 0, 0, 0);
      const toEndOfDay = new Date(to);
      toEndOfDay.setUTCHours(23, 59, 59, 999);
      query.created_at = { $gte: fromStartOfDay, $lte: toEndOfDay };
    }

    const contacts = await this.contactsModel.find(query).exec();
    if (contacts.length === 0) {
      throw new BadRequestException(
        'No contacts found in the specified date range',
      );
    }

    const exportData = contacts.map((contact) => ({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone_number,
      source: contact.source,
      lifetime_value: contact.lifetime_value,
      last_campaign_ran: contact.last_campaign_ran,
      last_interaction: contact.last_interaction,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    // Create a history entry for the export
    const historyEntry = new this.contactsHistoryModel({
      user_id: userData._id,
      type: 'exported',
      history: contacts.map((contact) => ({
        date: new Date(),
        contact_id: contact._id,
      })),
    });

    try {
      await historyEntry.save();
    } catch (error) {
      throw new BadRequestException('Failed to save export history');
    }

    return buffer;
  }
  async getAllContacts(
    searchKey?: string,
    status?: string,
    skip: number = 0,
    limit: number = 10,
    sort_dir: string = 'desc',
    tags?: string | string[],
    sort_field: string = 'created_at',
  ): Promise<{
    data: any[];
    meta: IPaginationMeta;
  }> {
    limit = Number(limit);
    skip = Number(skip);

    const sortDir: number = sort_dir === 'desc' ? -1 : 1;
    const sort = {
      [sort_field]: sortDir,
    } as Record<string, 1 | -1>;

    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const userId = userData._id;
    if (!userId) throw new BadRequestException('Invalid user id');

    let query: Record<string, any> = {
      user_id: userId,
    };

    if (searchKey) {
      const regex = new RegExp(searchKey, 'i'); // Common regex for string fields
      let numericSearchKey = Number(searchKey); // Convert searchKey to number
      let searchKeyIsNumeric = !isNaN(numericSearchKey); // Check if conversion is valid

      query.$or = [
        { first_name: regex },
        { last_name: regex },
        { email: regex },
        { source: regex },
        { last_campaign_ran: regex },
      ];

      if (searchKeyIsNumeric) {
        // Use numericSearchKey for numeric fields
        query.$or.push({ phone_number: numericSearchKey });
        query.$or.push({ lifetime_value: numericSearchKey });
      }
    }

    if (status) {
      query.status = status;
    }
    // if (tags) {
    //   const tagsArray = tags.split(',').map((tag) => tag.trim());
    //   query['tags.tag_name'] = { $in: tagsArray };
    // }

    if (tags) {
      const filter_tag = typeof tags === 'string' ? [tags] : tags;
      const tagsArray = filter_tag.map((tag: string) => tag.trim());
      query['tags.tag_name'] = { $in: tagsArray };
    }
    const data = await this.contactsModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const totalCount = await this.contactsModel.countDocuments(query);

    const meta: IPaginationMeta = {
      total: totalCount,
      limit: limit,
      page: skip / limit + 1,
      pages: Math.ceil(totalCount / limit),
    };

    return { data, meta };
  }

  async getContactByID(id: string): Promise<any> {
    const contactDetails = await this.contactsModel.findById({
      _id: new Types.ObjectId(id),
    });
    if (!contactDetails) {
      throw new BadRequestException('Contact not found');
    }
    return contactDetails;
  }
  async contactList(): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const contactDetails = await this.contactsModel.find({
      user_id: userData._id,
    });

    const transformedContacts = contactDetails.reduce(
      (acc: any, contact: any) => {
        acc[contact.phone_number] =
          `${contact.first_name} ${contact.last_name}`;
        return acc;
      },
      {},
    );

    return transformedContacts;
  }
}
