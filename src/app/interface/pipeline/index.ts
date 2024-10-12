import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { CreatePipelineDTO, UpdatePipelineDTO } from 'src/app/dto/pipeline';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractPipelineRepository {
  abstract createPipeline(
    createPipelineDto: CreatePipelineDTO,
  ): Promise<Pipeline | null>;
  abstract getPipeline(id: string): Promise<Pipeline | null>;
  abstract getAllPipelines(): Promise<Pipeline[] | null>;
  abstract updatePipelines(
    updatePipelineDto: UpdatePipelineDTO[],
  ): Promise<Pipeline[] | null>;
  abstract updatePipeline(
    id: string,
    updatePipelineDto: UpdatePipelineDTO,
  ): Promise<Pipeline | null>;
  abstract deletePipeline(id: string): Promise<Pipeline | null>;
  abstract exportPipelines(
    from?: Date,
    to?: Date,
    all?: boolean,
  ): Promise<Buffer>;
  abstract importPipelines(filePath: string): Promise<any>;
}

export abstract class AbstractPipelineService {
  abstract createPipeline(
    createPipelineDto: CreatePipelineDTO,
  ): Promise<Pipeline | null>;
  abstract getPipeline(id: string): Promise<Pipeline | null>;
  abstract getAllPipelines(): Promise<Pipeline[] | null>;
  abstract updatePipelines(
    updatePipelineDto: UpdatePipelineDTO[],
  ): Promise<Pipeline[] | null>;
  abstract updatePipeline(
    id: string,
    updatePipelineDto: UpdatePipelineDTO,
  ): Promise<Pipeline | null>;
  abstract deletePipeline(id: string): Promise<Pipeline | null>;
  abstract exportPipelines(
    from?: Date,
    to?: Date,
    all?: boolean,
  ): Promise<Buffer>;
  abstract importPipelines(filePath: string): Promise<any>;
}

export interface ExcelPipelineData {
  title: string;
}
