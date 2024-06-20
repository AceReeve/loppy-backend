import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import * as path from 'path';
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
  public defaultImagePath(id: string, original_name: string): string {
    const lineItemIdToString = id.toString();

    if (_.isEmpty(lineItemIdToString) || _.isEmpty(original_name))
      throw new BadRequestException('Unable to save s3 path');

    const today = new Date();
    const uuid = uuidv4();
    const initialPath = `${today.getFullYear()}/${this.getTwoDigitDate(
      today.getMonth() + 1,
    )}`;

    return `${initialPath}/user/image/${id}/${uuid}/${original_name}`;
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
      return result;
    }
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
    let s3Response;
    try {
      s3Response = await this.s3.upload(params).promise();
      return s3Response.Key;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  downloadFile(path: string) {
    try {
      if (this.bucket) {
        const result = this.s3_download({
          key: path,
          bucket: this.bucket,
        });
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Unable to download file from S3 : ${error}`,
      );
    }
  }
  s3_download({ key, bucket }: { key: string; bucket: string }) {
    try {
      const downloadParams = {
        Key: key,
        Bucket: bucket,
      };
      return this.s3.getObject(downloadParams).createReadStream();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Unable to download photo from S3 : ${error}`,
      );
    }
  }
}
