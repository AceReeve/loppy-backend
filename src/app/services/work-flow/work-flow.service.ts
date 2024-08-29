import { Injectable } from '@nestjs/common';
import {
  AbstractWorkFlowRepository,
  AbstractWorkFlowService,
} from 'src/app/interface/react-flow';

@Injectable()
export class WorkFlowService implements AbstractWorkFlowService {
  constructor(private readonly repository: AbstractWorkFlowRepository) {}

  async workFlow(): Promise<any> {
    return await this.repository.workFlow();
  }

  async getAllWorkFlow(): Promise<any> {
    return await this.repository.getAllWorkFlow();
  }

  async getWorkFlowById(id: string): Promise<any> {
    return await this.repository.getWorkFlowById(id);
  }
  async updateWorkFlowById(id: string, work_flow_name: string): Promise<any> {
    return await this.repository.updateWorkFlowById(id, work_flow_name);
  }
}
