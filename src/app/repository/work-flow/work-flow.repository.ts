import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRepository } from '../user/user.repository';
import { AbstractWorkFlowRepository } from 'src/app/interface/react-flow';
import {
  WorkFlow,
  WorkFlowDocument,
} from 'src/app/models/work-flow/work-flow.schema';
import {
  WorkFlowFolder,
  WorkFlowFolderDocument,
} from 'src/app/models/work-flow/work-flow-folder.schema';
import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import { CronService } from 'src/app/cron/cron.service';
import { WorkFlowFolderStatus, WorkFlowStatus } from 'src/app/const/action';
import { WorkFlowType } from 'src/app/const';

@Injectable()
export class WorkFlowRepository implements AbstractWorkFlowRepository {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(WorkFlowFolder.name)
    private workFlowFolderModel: Model<WorkFlowFolderDocument>,
    private cronService: CronService,
  ) {}

  async generateUniqueName(): Promise<string> {
    const length = 10;
    let uniqueName: string;
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 10-digit number as a string
      uniqueName = Math.random()
        .toString()
        .slice(2, 2 + length);
      // Check if this name already exists in the database
      const existingWorkflow = await this.workFlowModel.findOne({
        name: uniqueName,
      });
      if (!existingWorkflow) {
        isUnique = true;
      }
    }
    return uniqueName;
  }

  async workFlow(id: string, dto: CreateWorkflowDto): Promise<any> {
    try {
      const user = await this.userRepository.getLoggedInUserDetails();
      if (!user) {
        throw new Error('User not found or not authenticated');
      }

      // Generate a unique name
      const generatedName = await this.generateUniqueName.call(this);

      let createWorkFlow;

      if (id) {
        const folder = await this.workFlowFolderModel.findOne({
          _id: new Types.ObjectId(id),
        });

        if (!folder) {
          throw new Error(`Workflow folder ${id} not found`);
        }

        createWorkFlow = new this.workFlowModel({
          name: generatedName,
          created_by: user._id,
          folder_id: new Types.ObjectId(id),
          trigger: dto.trigger,
          action: dto.action,
          type: WorkFlowType.WORKFLOW,
        });
      } else {
        createWorkFlow = new this.workFlowModel({
          name: generatedName,
          created_by: user._id,
          trigger: dto.trigger,
          action: dto.action,
          Wtype: WorkFlowType.WORKFLOW,
        });
      }
      const savedWorkflow = await createWorkFlow.save();
      await this.cronService.handleCron();
      return savedWorkflow;
    } catch (error) {
      throw new Error(`Error in workFlow method: ${error.message}`);
    }
  }

  async updateWorkFlow(id: string, dto: UpdateWorkflowDto): Promise<any> {
    try {
      const user = await this.userRepository.getLoggedInUserDetails();
      if (!user) {
        throw new Error('User not found or not authenticated');
      }
      const workflow = await this.workFlowModel.findOne({
        _id: new Types.ObjectId(id),
      });

      if (!workflow) {
        throw new Error(`Workflow ${id} not found`);
      }
      let createWorkFlow;

      if (dto.folder_id) {
        const folder = await this.workFlowFolderModel.findOne({
          _id: new Types.ObjectId(dto.folder_id),
        });

        if (!folder) {
          throw new Error(`Workflow folder ${dto.folder_id} not found`);
        }

        createWorkFlow = await this.workFlowModel.findOneAndUpdate(
          {
            _id: new Types.ObjectId(id),
          },
          {
            $set: {
              name: dto.workflow_name,
              created_by: user._id,
              folder_id: new Types.ObjectId(id),
              trigger: dto.trigger,
              action: dto.action,
              status: dto.status,
            },
          },
          {
            new: true,
          },
        );
      } else {
        createWorkFlow = await this.workFlowModel.findOneAndUpdate(
          {
            _id: new Types.ObjectId(id),
          },
          {
            $set: {
              name: dto.workflow_name,
              created_by: user._id,
              trigger: dto.trigger,
              action: dto.action,
              status: dto.status,
            },
          },
          {
            new: true,
          },
        );
      }
      return createWorkFlow;
    } catch (error) {
      throw new Error(`Error in workFlow method: ${error.message}`);
    }
  }
  async getAllWorkFlow(folder_id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    if (folder_id) {
      const workflow = await this.workFlowModel.find({
        created_by: user._id,
        folder_id: new Types.ObjectId(folder_id),
      });
      return workflow;
    } else {
      const workflow = await this.workFlowModel.find({
        created_by: user._id,
      });
      return workflow;
    }
  }

  async getWorkFlowById(id: string): Promise<any> {
    const result = await this.workFlowModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new Error(`workflow with the ID: ${id} not found `);
    }
    return result;
  }

  async updateWorkFlowById(id: string, name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateWorkFlowName = await this.workFlowModel.findOne({
      created_by: user._id,
      name: name,
    });
    if (validateWorkFlowName) {
      throw new Error(`workflow is already exist or it is same as before`);
    }
    const result = await this.workFlowModel.findOneAndUpdate(
      {
        created_by: user._id,
        _id: new Types.ObjectId(id),
      },
      {
        $set: {
          name: name,
        },
      },
      {
        new: true,
      },
    );

    if (!result) {
      throw new Error(`workflow failed to update `);
    }
    return result;
  }
  async publishedWorkFlow(id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const result = await this.workFlowModel.findOneAndUpdate(
      {
        created_by: user._id,
        _id: new Types.ObjectId(id),
      },
      {
        $set: {
          status: WorkFlowStatus.PUBLISHED,
        },
      },
      {
        new: true,
      },
    );

    if (!result) {
      throw new Error(`workflow failed to published `);
    }
    return result;
  }

  //folder
  async folder(name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateFolderName = await this.workFlowFolderModel.findOne({
      name: name,
      created_by: user._id,
      status: WorkFlowFolderStatus.ACTIVE,
    });
    if (validateFolderName) {
      throw new Error(`folder  ${name} is already exist `);
    }
    const createWorkFlowFolder = new this.workFlowFolderModel({
      name: name,
      created_by: user._id,
      type: WorkFlowType.FOLDER,
    });
    return await createWorkFlowFolder.save();
  }

  async getAllFolder(): Promise<any> {
    try {
      const user = await this.userRepository.getLoggedInUserDetails();
      const folders = await this.workFlowFolderModel
        .find({
          created_by: user._id,
          status: WorkFlowFolderStatus.ACTIVE,
        })
        .exec();

      const foldersWithWorkflows = await Promise.all(
        folders.map(async (folder) => {
          const workflows = await this.workFlowModel
            .find({
              folder_id: folder._id,
            })
            .exec();

          // Ensure type assertion here
          const formattedWorkflows = workflows.map((workflow) => ({
            _id: workflow._id,
            type: workflow.type,
            work_flow_name: workflow.name,
            created_by: workflow.created_by,
            status: workflow.status,
            created_at: workflow.created_at,
            updated_at: workflow.updated_at,
          }));

          return {
            ...folder.toObject(),
            workflows: formattedWorkflows,
          };
        }),
      );

      const workflowsWithoutFolder = await this.workFlowModel
        .find({
          folder_id: { $exists: false },
        })
        .exec();

      const formattedWorkflowsWithoutFolder = workflowsWithoutFolder.map(
        (workflow) => ({
          _id: workflow._id,
          name: workflow.name,
          type: workflow.type,
          status: workflow.status,
          created_at: workflow.created_at,
          updated_at: workflow.updated_at,
        }),
      );
      return {
        folders: foldersWithWorkflows,
        workflowsWithoutFolder: formattedWorkflowsWithoutFolder,
      };
    } catch (error) {
      throw new Error(
        'Error fetching workflow folders and their workflows: ' + error.message,
      );
    }
  }

  async getFolderById(id: string): Promise<any> {
    try {
      const workflowFolder = await this.workFlowFolderModel.findById(id).exec();

      if (!workflowFolder) {
        throw new Error('Workflow folder not found');
      }

      const workFlowData = await this.workFlowModel
        .find({
          folder_id: workflowFolder._id,
        })
        .exec();

      return {
        ...workflowFolder.toObject(),
        workflows: workFlowData,
      };
    } catch (error) {
      throw new Error(
        'Error fetching workflow folder and its workflows: ' + error.message,
      );
    }
  }

  async updateFolderById(id: string, name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateWorkFlowName = await this.workFlowFolderModel.findOne({
      created_by: user._id,
      name: name,
    });
    if (validateWorkFlowName) {
      throw new Error(`workflow is already exist or it is same as before`);
    }
    const result = await this.workFlowFolderModel.findOneAndUpdate(
      {
        created_by: user._id,
        _id: new Types.ObjectId(id),
      },
      {
        $set: {
          name: name,
        },
      },
      {
        new: true,
      },
    );

    if (!result) {
      throw new Error(`workflow folder failed to update `);
    }
    return result;
  }

  async deleteFolderById(id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const result = await this.workFlowFolderModel.findOneAndUpdate(
      {
        created_by: user._id,
        _id: new Types.ObjectId(id),
      },
      {
        $set: {
          status: WorkFlowFolderStatus.DELETED,
        },
      },
      {
        new: true,
      },
    );
    await this.workFlowModel.findOneAndUpdate(
      {
        folder_id: new Types.ObjectId(id),
      },
      {
        $set: {
          folder_id: '',
        },
      },
    );
    if (!result) {
      throw new Error(`workflow folder failed to delete `);
    }
    return result;
  }
}
