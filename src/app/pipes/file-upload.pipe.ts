import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class FileUploadPipe implements PipeTransform {
  async transform(value: {
    image_1?: Express.Multer.File[];
    image_2?: Express.Multer.File[];
    image_3?: Express.Multer.File[];
    image_4?: Express.Multer.File[];
    image_5?: Express.Multer.File[];
  }) {
    
    if (!value) return;

    const {
      image_1,
      image_2,
      image_3,
      image_4,
      image_5
    } = value;

    const images = [
      image_1,
      image_2,
      image_3,
      image_4,
      image_5,
    ];

    const allowedMimeType = [
      'image/png',
      'image/jpg',
      'image/jpeg'
    ];

    images.forEach((image) => {
      if (!_.isEmpty(image)) {
        image?.forEach((file) => {
          if (!_.isEmpty(file)) {
            if (!allowedMimeType.includes(file.mimetype)) {
              throw new BadRequestException(
                'Unable to upload file. Only .png, .jpg, .jpeg files are allowed',
              );
            }
            if (file.size > 8388608) {
              throw new BadRequestException(
                'Unable to upload file. File cannot be larger than 8MB',
              );
            }
          }
        });
      } else {
      }
    });
  
    return value;
  }
}
