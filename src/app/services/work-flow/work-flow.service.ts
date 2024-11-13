import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import {
  AbstractWorkFlowRepository,
  AbstractWorkFlowService,
} from 'src/app/interface/react-flow';
import { UserInterface } from 'src/app/interface/user';

@Injectable()
export class WorkFlowService implements AbstractWorkFlowService {
  constructor(private readonly repository: AbstractWorkFlowRepository) {}

  async workFlow(req: UserInterface,id: string, template_id: string): Promise<any> {
    return await this.repository.workFlow(req, id, template_id);
  }
  async updateWorkFlow(req: UserInterface,id: string, dto: UpdateWorkflowDto): Promise<any> {
    return await this.repository.updateWorkFlow(req, id, dto);
  }
  async publishedWorkFlow(req: UserInterface,id: string, published: Boolean): Promise<any> {
    return await this.repository.publishedWorkFlow(req,id, published);
  }

  async getAllWorkFlow(req: UserInterface,folder_id: string): Promise<any> {
    return await this.repository.getAllWorkFlow(req, folder_id);
  }

  async getWorkFlowById(id: string): Promise<any> {
    return await this.repository.getWorkFlowById(id);
  }
  async updateWorkFlowById(req: UserInterface,id: string, name: string): Promise<any> {
    return await this.repository.updateWorkFlowById(req, id, name);
  }

  //folder
  async folder(req: UserInterface,name: string, id: string): Promise<any> {
    return await this.repository.folder(req, name, id);
  }

  async getAllFolder(req: UserInterface,id: string): Promise<any> {
    return await this.repository.getAllFolder(req, id);
  }

  async getFolderById(id: string): Promise<any> {
    return await this.repository.getFolderById(id);
  }
  async updateFolderById(req: UserInterface,id: string, name: string): Promise<any> {
    return await this.repository.updateFolderById(req, id, name);
  }
  async deleteFolderById(req: UserInterface,id: string): Promise<any> {
    return await this.repository.deleteFolderById(req, id);
  }
  async getAllWorkFlowDropDownList(req: UserInterface,): Promise<any> {
    return await this.repository.getAllWorkFlowDropDownList(req);
  }
}
