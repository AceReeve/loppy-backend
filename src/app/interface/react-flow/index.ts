export abstract class AbstractWorkFlowRepository {
  abstract workFlow(): Promise<any>;
  abstract getAllWorkFlow(): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, work_flow_name: string): Promise<any>;
}

export abstract class AbstractWorkFlowService {
  abstract workFlow(): Promise<any>;
  abstract getAllWorkFlow(): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, work_flow_name: string): Promise<any>;
}
