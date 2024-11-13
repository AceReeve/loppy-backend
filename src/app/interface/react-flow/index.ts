import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import { UserInterface } from '../user';

export abstract class AbstractWorkFlowRepository {
  abstract workFlow(req: UserInterface,id: string, template_id: string): Promise<any>;
  abstract updateWorkFlow(req: UserInterface,id: string, dto: UpdateWorkflowDto): Promise<any>;
  abstract publishedWorkFlow(req: UserInterface,id: string, published: Boolean): Promise<any>;
  abstract getAllWorkFlow(req: UserInterface,folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(req: UserInterface,id: string, name: string): Promise<any>;
  //folder
  abstract folder(req: UserInterface,name: string, id: string): Promise<any>;
  abstract getAllFolder(req: UserInterface,id: string): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(req: UserInterface,id: string, name: string): Promise<any>;
  abstract deleteFolderById(req: UserInterface,id: string): Promise<any>;
  abstract getAllWorkFlowDropDownList(req: UserInterface,): Promise<any>;

}

export abstract class AbstractWorkFlowService {
  abstract workFlow(req: UserInterface,id: string,  template_id: string): Promise<any>;
  abstract updateWorkFlow(req: UserInterface, id: string, dto: UpdateWorkflowDto): Promise<any>;
  abstract publishedWorkFlow(req: UserInterface,id: string, published: Boolean): Promise<any>;
  abstract getAllWorkFlow(req: UserInterface,folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(req: UserInterface,id: string, name: string): Promise<any>;
  //folder
  abstract folder(req: UserInterface,name: string, id: string): Promise<any>;
  abstract getAllFolder(req: UserInterface,id: string): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(req: UserInterface,id: string, name: string): Promise<any>;
  abstract deleteFolderById(req: UserInterface,id: string): Promise<any>;
  abstract getAllWorkFlowDropDownList(req: UserInterface,): Promise<any>;

  
}
