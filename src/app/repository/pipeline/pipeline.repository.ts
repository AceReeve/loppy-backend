import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import { AbstractPipelineRepository } from 'src/app/interface/pipeline';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';

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
}
