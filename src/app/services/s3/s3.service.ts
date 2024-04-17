import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

export interface IFile {
  file: Buffer;
  bucket: string;
  fileName: string;
  mimetype: string;
}

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}
  private bucket = this.configService.get<string>('AWS_BUCKET_NAME');
  private s3 = new AWS.S3({
    accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
    secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
    region: this.configService.get<string>('AWS_BUCKET_REGION'),
  });
  private getTwoDigitDate(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
  public defaultNonCatalogLineItemImagePath(original_name: string): string {
    const today = new Date();
    const uuid = uuidv4();
    const initialPath = `${today.getFullYear()}/${this.getTwoDigitDate(
      today.getMonth() + 1,
    )}`;

    return `${initialPath}/servicehero/files/${uuid}/${original_name}`;
  }

  async uploadImage(
    file: Express.Multer.File,
    path: string,
  ): Promise<string | null> {
    const { buffer, mimetype } = file;
    if (this.bucket) {
      const result = await this.s3_upload_image({
        file: buffer,
        bucket: this.bucket,
        fileName: path,
        mimetype: mimetype,
      });
      console.log('1');
      return result;
    }
    console.log('2');

    return null;
  }
  async s3_upload_image({ file, bucket, fileName, mimetype }: IFile) {
    const params = {
      Bucket: this.bucket ?? bucket,
      Key: fileName,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };
    console.log('3');

    let s3Response;
    try {
      s3Response = await this.s3.upload(params).promise();
      console.log('4');

      return s3Response.Key;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
