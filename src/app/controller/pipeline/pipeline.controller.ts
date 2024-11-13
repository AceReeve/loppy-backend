import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Res,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import { AbstractPipelineService } from 'src/app/interface/pipeline';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserInterface } from 'src/app/interface/user';

@ApiTags('Pipelines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('pipelines')
export class PipelineController {
  constructor(private readonly pipelineService: AbstractPipelineService) {}

  @Post()
  @ApiOperation({ summary: 'Create pipeline' })
  async createPipeline(
    @Body() createPipelineDTO: CreatePipelineDTO,
  ): Promise<Pipeline | null> {
    return await this.pipelineService.createPipeline(createPipelineDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get pipelines' })
  async getAllPipelines(): Promise<Pipeline[] | null> {
    return await this.pipelineService.getAllPipelines();
  }

  @Get('pipelines-list')
  @ApiOperation({ summary: 'Get pipelines' })
  async getAllPipelinesList(@Request() req: UserInterface, ): Promise<Pipeline[] | null> {
    return await this.pipelineService.getAllPipelinesList(req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline' })
  async getPipeline(@Param('id') id: string): Promise<Pipeline | null> {
    return await this.pipelineService.getPipeline(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update pipelines' })
  async updatePipelines(
    @Body() updatePipelineDto: UpdatePipelineDTO[],
  ): Promise<Pipeline[]> {
    return await this.pipelineService.updatePipelines(updatePipelineDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async updatePipeline(
    @Param('id') id: string,
    @Body() updatePipelineDto: UpdatePipelineDTO,
  ): Promise<Pipeline | null> {
    return await this.pipelineService.updatePipeline(id, updatePipelineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pipeline' })
  async deletePipeline(@Param('id') id: string): Promise<Pipeline | null> {
    return await this.pipelineService.deletePipeline(id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export Pipelines' })
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
  async exportPipelines(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('all') all?: boolean,
  ) {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (all === true) {
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
      const buffer = await this.pipelineService.exportPipelines(
        fromDate,
        toDate,
        all,
      );

      const filename = `pipelines_export_${new Date().toISOString()}.xlsx`;

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
          message: 'Failed to export pipelines',
          error: error.message,
        });
      }
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Import Pipelines' })
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
  async importPipelines(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(`No file uploaded`);
    }
    await this.pipelineService.importPipelines(file.path);
    return { message: 'Pipelines imported successfully' };
  }
}
