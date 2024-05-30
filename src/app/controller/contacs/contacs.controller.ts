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
import { BadRequestException } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @Get('export')
  @ApiOperation({ summary: 'Export Contacts' })
  @ApiQuery({
    name: 'from',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'to',
    required: false,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'all',
    required: false,
  } as ApiQueryOptions)
  async exportContacts(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('all') all?: boolean,
  ) {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (all) {
      fromDate = undefined;
      toDate = undefined;
    } else {
      if (from) {
        fromDate = new Date(from);
      }
      if (to) {
        toDate = new Date(to);
      }
      if (fromDate && toDate && fromDate > toDate) {
        return res.status(400).json({
          code: 400,
          message: '"from" date must be earlier than "to" date',
        });
      }
    }

    try {
      const buffer = await this.abstractContactsService.exportContacts(
        fromDate,
        toDate,
      );

      const filename = `contacts_export_${new Date().toISOString()}.xlsx`;

      res.set({
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      res.send(buffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(400).json({
          code: 400,
          message: error.message,
        });
      } else {
        res.status(500).json({
          code: 500,
          message: 'Failed to export contacts',
          error: error.message,
        });
      }
    }
  }

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
      throw new BadRequestException(`No file uploaded`);
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
