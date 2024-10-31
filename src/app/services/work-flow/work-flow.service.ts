import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import {
  AbstractWorkFlowRepository,
  AbstractWorkFlowService,
} from 'src/app/interface/react-flow';

@Injectable()
export class WorkFlowService implements AbstractWorkFlowService {
  constructor(private readonly repository: AbstractWorkFlowRepository) {}

  async workFlow(id: string, template_id: string): Promise<any> {
    return await this.repository.workFlow(id, template_id);
  }
  async updateWorkFlow(id: string, dto: UpdateWorkflowDto): Promise<any> {
    return await this.repository.updateWorkFlow(id, dto);
  }
  async publishedWorkFlow(id: string, published: Boolean): Promise<any> {
    return await this.repository.publishedWorkFlow(id, published);
  }

  async getAllWorkFlow(folder_id: string): Promise<any> {
    return await this.repository.getAllWorkFlow(folder_id);
  }

  async getWorkFlowById(id: string): Promise<any> {
    return await this.repository.getWorkFlowById(id);
  }
  async updateWorkFlowById(id: string, name: string): Promise<any> {
    return await this.repository.updateWorkFlowById(id, name);
  }

  //folder
  async folder(name: string, id: string): Promise<any> {
    return await this.repository.folder(name, id);
  }

  async getAllFolder(id: string): Promise<any> {
    return await this.repository.getAllFolder(id);
  }

  async getFolderById(id: string): Promise<any> {
    return await this.repository.getFolderById(id);
  }
  async updateFolderById(id: string, name: string): Promise<any> {
    return await this.repository.updateFolderById(id, name);
  }
  async deleteFolderById(id: string): Promise<any> {
    return await this.repository.deleteFolderById(id);
  }
  async getAllWorkFlowDropDownList(): Promise<any> {
    return await this.repository.getAllWorkFlowDropDownList();
  }
}
