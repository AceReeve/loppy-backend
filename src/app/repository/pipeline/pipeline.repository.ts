import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import {
  AbstractPipelineRepository,
  ExcelPipelineData,
} from 'src/app/interface/pipeline';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';
import * as XLSX from 'xlsx';

@Injectable()
export class PipelineRepository implements AbstractPipelineRepository {
  constructor(
    @InjectModel(Pipeline.name)
    private pipelineModel: Model<Pipeline & Document>,
  ) {}

  async getAllPipelines(): Promise<Pipeline[] | null> {
    return await this.pipelineModel
      .find({})
      .populate({
        path: 'opportunities',
        populate: {
          path: 'leads',
        },
      })
      .exec();
  }

  async getPipeline(id: string): Promise<Pipeline | null> {
    return await this.pipelineModel
      .findById(id)
      .populate({
        path: 'opportunities',
        populate: {
          path: 'leads',
        },
      })
      .exec();
  }
  async createPipeline(
    createPipelineDto: CreatePipelineDTO,
  ): Promise<Pipeline | null> {
    return await this.pipelineModel.create(createPipelineDto);
  }

  async updatePipelines(
    updatePipelineDto: UpdatePipelineDTO[],
  ): Promise<Pipeline[] | null> {
    const updatedPipelines: Pipeline[] = [];

    for (const pipelineData of updatePipelineDto) {
      const { _id, ...updateFields } = pipelineData;

      const updatedPipeline = await this.pipelineModel
        .findByIdAndUpdate(_id, { $set: updateFields }, { new: true })
        .exec();

      if (updatedPipeline) {
        updatedPipelines.push(updatedPipeline);
      }
    }

    return updatedPipelines.length > 0 ? updatedPipelines : null;
  }

  async updatePipeline(
    id: string,
    updatePipelineDto: UpdatePipelineDTO,
  ): Promise<Pipeline | null> {
    try {
      console.log(id);
      const pipeline = await this.pipelineModel
        .findByIdAndUpdate(id, updatePipelineDto, { new: true })
        .exec();

      return pipeline;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async deletePipeline(id: string): Promise<Pipeline | null> {
    return await this.pipelineModel.findByIdAndDelete(id).exec();
  }

  async exportPipelines(
    from?: Date,
    to?: Date,
    all?: boolean,
  ): Promise<Buffer> {
    const query: any = {};
    if (from && to && all !== true) {
      const fromStartOfDay = new Date(from);
      fromStartOfDay.setUTCHours(0, 0, 0, 0);
      const toEndOfDay = new Date(to);
      toEndOfDay.setUTCHours(23, 59, 59, 999);
      query.created_at = { $gte: fromStartOfDay, $lte: toEndOfDay };
    }

    const pipelines = await this.pipelineModel.find(query).exec();
    if (pipelines.length === 0) {
      throw new BadRequestException(
        'No pipelines found in the specified date range',
      );
    }

    const exportData = pipelines.map((pipeline) => ({
      title: pipeline.title,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  }

  async importPipelines(filePath: string): Promise<any> {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: ExcelPipelineData[] = XLSX.utils.sheet_to_json(sheet);

    // Track rows that already exist
    const existingPipelines: ExcelPipelineData[] = [];
    const importedPipelines: any[] = [];

    // Process each row
    for (const item of data) {
      const existingPipeline = await this.pipelineModel.findOne({
        $or: [{ title: item.title }],
      });
      if (existingPipeline) {
        existingPipelines.push(item);
      } else {
        const pipeline = new this.pipelineModel({
          title: item.title,
        });

        try {
          await pipeline.save();
          importedPipelines.push(pipeline);
        } catch (error) {
          throw new BadRequestException('Failed to import pipeline');
        }
      }
    }

    if (existingPipelines.length > 0) {
      const existingDetails = existingPipelines
        .map((pipeline) => `Title: ${pipeline.title}`)
        .join(', ');
      throw new BadRequestException(
        `Pipelines with the following details already exist and were not saved: ${existingDetails}`,
      );
    }

    return { message: 'All Pipelines imported successfully' };
  }
}
