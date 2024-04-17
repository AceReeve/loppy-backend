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
  AbstractFileUploadRepository,
  Files,
} from 'src/app/interface/file-upload';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/app/models/file-upload/file-upload.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/app/services/s3/s3.service';

@Injectable()
export class FileUploadRepository implements AbstractFileUploadRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private configService: ConfigService,
    private readonly s3: S3Service,
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
}
