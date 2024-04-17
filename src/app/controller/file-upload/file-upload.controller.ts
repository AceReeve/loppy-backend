import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  Param,
  StreamableFile,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/app/guard/auth';
import {
  AbstractFileUploadService,
  Files,
} from 'src/app/interface/file-upload';
import { FileUploadPipe } from 'src/app/pipes/file-upload.pipe';

@ApiTags('Non Catalog Line Item')
@Controller('non-catalog-line-item')
export class FileUploadController {
  constructor(
    private readonly abstractFileUploadService: AbstractFileUploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('file/save')
  @ApiOperation({
    summary: 'Upload Files',
  })
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'Successfully upload service document collection',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields - Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'An internal error occured',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_1' },
      { name: 'image_2' },
      { name: 'image_3' },
      { name: 'image_4' },
      { name: 'image_5' },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  async updateNonCatalogLineItemImageUpload(
    @UploadedFiles(FileUploadPipe) files: Files,
  ) {
    return await this.abstractFileUploadService.fileUpload(files);
  }
}
