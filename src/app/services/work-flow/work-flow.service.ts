import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import {
  AbstractWorkFlowRepository,
  AbstractWorkFlowService,
} from 'src/app/interface/react-flow';

@Injectable()
export class WorkFlowService implements AbstractWorkFlowService {
  constructor(private readonly repository: AbstractWorkFlowRepository) {}

  async workFlow(id: string, dto: CreateWorkflowDto): Promise<any> {
    return await this.repository.workFlow(id, dto);
  }
  async updateWorkFlow(id: string, dto: UpdateWorkflowDto): Promise<any> {
    return await this.repository.updateWorkFlow(id, dto);
  }

  async getAllWorkFlow(folder_id: string): Promise<any> {
    return await this.repository.getAllWorkFlow(folder_id);
  }

  async getWorkFlowById(id: string): Promise<any> {
    return await this.repository.getWorkFlowById(id);
  }
  async updateWorkFlowById(id: string, work_flow_name: string): Promise<any> {
    return await this.repository.updateWorkFlowById(id, work_flow_name);
  }

  //folder
  async folder(folder_name: string): Promise<any> {
    return await this.repository.folder(folder_name);
  }

  async getAllFolder(): Promise<any> {
    return await this.repository.getAllFolder();
  }

  async getFolderById(id: string): Promise<any> {
    return await this.repository.getFolderById(id);
  }
  async updateFolderById(id: string, folder_name: string): Promise<any> {
    return await this.repository.updateFolderById(id, folder_name);
  }
}
