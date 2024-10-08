import { Injectable } from '@nestjs/common';
import {
  AbstractPipelineRepository,
  AbstractPipelineService,
} from 'src/app/interface/pipeline';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';

@Injectable()
export class PipelineService implements AbstractPipelineService {
  constructor(private readonly repository: AbstractPipelineRepository) {}

  async getAllPipelines(): Promise<Pipeline[] | null> {
    return await this.repository.getAllPipelines();
  }
  async createPipeline(
    createPipelineDto: CreatePipelineDTO,
  ): Promise<Pipeline | null> {
    return await this.repository.createPipeline(createPipelineDto);
  }

  async updatePipelines(
    updatePipelineDto: UpdatePipelineDTO[],
  ): Promise<Pipeline[] | null> {
    return await this.repository.updatePipelines(updatePipelineDto);
  }

  async updatePipeline(
    id: string,
    updatePipelineDto: UpdatePipelineDTO,
  ): Promise<Pipeline | null> {
    return await this.repository.updatePipeline(id, updatePipelineDto);
  }

  async deletePipeline(id: string): Promise<Pipeline | null> {
    return await this.repository.deletePipeline(id);
  }
}
