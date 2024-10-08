import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import { AbstractPipelineService } from 'src/app/interface/pipeline';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';

@ApiTags('Pipelines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('pipeline')
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
}
