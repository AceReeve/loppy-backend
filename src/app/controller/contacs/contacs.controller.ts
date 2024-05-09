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
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiQueryOptions,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { AbstractContactsService, Files } from 'src/app/interface/contacts';
import { FileUploadPipe } from 'src/app/pipes/file-upload.pipe';
import { ContactsDTO, FilterTags } from 'src/app/dto/contacts';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@ApiTags('Contacts')
@Controller('Contacts')
export class ContactsController {
  constructor(
    private readonly abstractContactsService: AbstractContactsService,
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
    return await this.abstractContactsService.fileUpload(files);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create Contacts',
  })
  @ApiBearerAuth('Bearer')
  async createContacts(@Body() contactsDTO: ContactsDTO) {
    return await this.abstractContactsService.createContacts(contactsDTO);
  }

  // @Post('import')
  // @UseInterceptors(FileInterceptor('file'))f
  // async importContacts(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file); // This should now include a path property
  //   if (!file) {
  //     return { message: 'No file uploaded' };
  //   }
  //   console.log('File path:', file.path);
  //   await this.abstractContactsService.importContacts(file.path);
  //   return { message: 'Contacts imported successfully' };
  // }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          'C:/serviceherorepository/BE/serviceherocrm-backend/uploads',
        filename: (req, file, cb) => {
          const filename: string =
            file.originalname.replace(/\s+/g, '') +
            '-' +
            Date.now() +
            extname(file.originalname);
          cb(null, filename);
        },
      }),
    }),
  )
  async importContacts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    await this.abstractContactsService.importContacts(file.path);
    return { message: 'Contacts imported successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  @ApiOperation({ summary: 'Filter All Contacts' })
  @ApiBearerAuth('Bearer')
  @ApiQuery({
    name: 'search_key',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'status',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'skip',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'limit',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'sort_dir',
    required: false,
  } as ApiQueryOptions)
  async getAll(
    @Query('search_key') searchKey?: string,
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('sort_dir') sort_dir?: string,
    @Query() query?: FilterTags,
  ): Promise<any> {
    const tags = query.tag;
    return await this.abstractContactsService.getAllContacts(
      searchKey,
      status,
      skip,
      limit,
      sort_dir,
      tags,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get Contact By ID' })
  @ApiBearerAuth('Bearer')
  async getContactByID(@Param('id') id: string): Promise<any> {
    return await this.abstractContactsService.getContactByID(id);
  }
}
