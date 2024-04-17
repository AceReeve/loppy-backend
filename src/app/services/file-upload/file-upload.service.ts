import { Injectable } from '@nestjs/common';
import {
  AbstractFileUploadRepository,
  AbstractFileUploadService,
  Files,
} from 'src/app/interface/file-upload';

@Injectable()
export class FileUploadService implements AbstractFileUploadService {
  constructor(
    private readonly abstractFileUploadRepository: AbstractFileUploadRepository,
  ) {}

  async fileUpload(files: Files): Promise<any> {
    return this.abstractFileUploadRepository.fileUpload(files);
  }
}
