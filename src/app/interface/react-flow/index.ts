import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';

export abstract class AbstractWorkFlowRepository {
  abstract workFlow(id: string, template_id: string): Promise<any>;
  abstract updateWorkFlow(id: string, dto: UpdateWorkflowDto): Promise<any>;
  abstract publishedWorkFlow(id: string): Promise<any>;
  abstract getAllWorkFlow(folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, name: string): Promise<any>;
  //folder
  abstract folder(name: string, id: string): Promise<any>;
  abstract getAllFolder(id: string): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(id: string, name: string): Promise<any>;
  abstract deleteFolderById(id: string): Promise<any>;
}

export abstract class AbstractWorkFlowService {
  abstract workFlow(id: string, template_id: string): Promise<any>;
  abstract updateWorkFlow(id: string, dto: UpdateWorkflowDto): Promise<any>;
  abstract publishedWorkFlow(id: string): Promise<any>;
  abstract getAllWorkFlow(folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, name: string): Promise<any>;
  //folder
  abstract folder(name: string, id: string): Promise<any>;
  abstract getAllFolder(id: string): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(id: string, name: string): Promise<any>;
  abstract deleteFolderById(id: string): Promise<any>;
}
