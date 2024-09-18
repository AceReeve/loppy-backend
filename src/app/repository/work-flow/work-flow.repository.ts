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
import { WorkFlowStatus } from 'src/app/const/action';
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

  async workFlow(id: string, template_id: string): Promise<any> {
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
          trigger: [],
          action: [],
          type: WorkFlowType.WORKFLOW,
        });
      } else {
        createWorkFlow = new this.workFlowModel({
          name: generatedName,
          created_by: user._id,
          trigger: [],
          action: [],
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
        status: { $ne: WorkFlowStatus.DELETED },
      });
      return workflow;
    } else {
      const workflow = await this.workFlowModel.find({
        created_by: user._id,
        status: { $ne: WorkFlowStatus.DELETED },
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
  async folder(name: string, id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateFolderName = await this.workFlowFolderModel.findOne({
      name: name,
      created_by: user._id,
      status: WorkFlowStatus.ACTIVE,
      folder_id: { $exists: false },
    });
    if (validateFolderName) {
      throw new Error(`folder  ${name} is already exist `);
    }
    let createWorkFlowFolder: any;
    if (id) {
      const validateFolderName = await this.workFlowFolderModel.findOne({
        _id: new Types.ObjectId(id),
      });
      if (!validateFolderName) {
        throw new Error(`folder ID not found `);
      }
      createWorkFlowFolder = new this.workFlowFolderModel({
        name: name,
        created_by: user._id,
        type: WorkFlowType.FOLDER,
        folder_id: validateFolderName._id,
      });
    } else {
      createWorkFlowFolder = new this.workFlowFolderModel({
        name: name,
        created_by: user._id,
        type: WorkFlowType.FOLDER,
      });
    }

    return await createWorkFlowFolder.save();
  }

  async getAllFolder(id: string): Promise<any> {
    try {
      const user = await this.userRepository.getLoggedInUserDetails();

      if (id) {
        const folders = await this.workFlowFolderModel
          .find({
            folder_id: new Types.ObjectId(id),
            created_by: user._id,
            status: { $ne: WorkFlowStatus.DELETED },
          })
          .exec();

        const workflows = await this.workFlowModel
          .find({
            folder_id: new Types.ObjectId(id),
            created_by: user._id,
            status: { $ne: WorkFlowStatus.DELETED },
          })
          .exec();

        const formattedWorkflowsFolder = folders.map((folder) => ({
          _id: folder._id,
          type: folder.type || 'Folder',
          name: folder.name || 'no name',
          created_by: folder.created_by,
          status: folder.status,
          created_at: folder.created_at,
          updated_at: folder.updated_at,
        }));
        const formattedWorkflows = workflows.map((workflow) => ({
          _id: workflow._id,
          type: workflow.type || 'Workflow',
          name: workflow.name || 'no name',
          created_by: workflow.created_by,
          status: workflow.status,
          created_at: workflow.created_at,
          updated_at: workflow.updated_at,
        }));

        return [...formattedWorkflowsFolder, ...formattedWorkflows];
      } else {
        // Fetch folders created by the logged-in user
        // Fetch workflows that are not in any folder
        const folders = await this.workFlowFolderModel
          .find({
            created_by: user._id,
            status: { $ne: WorkFlowStatus.DELETED },
            folder_id: { $exists: false },
          })
          .exec();
        const formattedFolder = folders.map((folder) => ({
          _id: folder._id,
          type: folder.type || 'Folder',
          name: folder.name || 'no name',
          created_by: folder.created_by,
          status: folder.status,
          created_at: folder.created_at,
          updated_at: folder.updated_at,
        }));

        const workflowsWithoutFolder = await this.workFlowModel
          .find({
            created_by: user._id,
            folder_id: { $exists: false },
            status: { $ne: WorkFlowStatus.DELETED },
          })
          .exec();

        // Format the workflows without folder
        const formattedWorkflowsWithoutFolder = workflowsWithoutFolder.map(
          (workflow) => ({
            _id: workflow._id,
            type: workflow.type || 'Workflow',
            name: workflow.name || 'no name',
            created_by: workflow.created_by,
            status: workflow.status,
            created_at: workflow.created_at,
            updated_at: workflow.updated_at,
          }),
        );

        // Combine both folders with workflows and workflows without folders
        return [...formattedFolder, ...formattedWorkflowsWithoutFolder];
      }
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
    const validateWorkFlowFolderName = await this.workFlowFolderModel.findOne({
      created_by: user._id,
      name: name,
    });
    const workFlowFolderName = await this.workFlowFolderModel.findOne({
      created_by: user._id,
    });

    if (validateWorkFlowFolderName) {
      throw new Error(`workflow is already exist or it is same as before`);
    }

    const validateWorkFlowName = await this.workFlowModel.findOne({
      created_by: user._id,
      name: name,
    });
    const workFlowName = await this.workFlowModel.findOne({
      created_by: user._id,
    });

    if (validateWorkFlowName) {
      throw new Error(`workflow is already exist or it is same as before`);
    }

    let result: any;
    if (workFlowFolderName) {
      result = await this.workFlowFolderModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          created_by: user._id,
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
    }

    if (workFlowName) {
      result = await this.workFlowModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          created_by: user._id,
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
    }

    return result;
  }

  async deleteFolderById(id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const folder = await this.workFlowFolderModel.findOne({
      _id: new Types.ObjectId(id),
    });
    const workflow = await this.workFlowModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (folder) {
      const result = await this.workFlowFolderModel.findOneAndUpdate(
        {
          created_by: user._id,
          _id: new Types.ObjectId(id),
        },
        {
          $set: {
            status: WorkFlowStatus.DELETED,
          },
        },
        {
          new: true,
        },
      );
      await this.workFlowModel.updateMany(
        {
          folder_id: new Types.ObjectId(id),
        },
        {
          $set: {
            status: WorkFlowStatus.DELETED,
          },
        },
      );
      if (!result) {
        throw new Error(`workflow folder failed to delete `);
      }
      return result;
    }
    if (workflow) {
      const result = await this.workFlowModel.findOneAndUpdate(
        {
          created_by: user._id,
          _id: new Types.ObjectId(id),
        },
        {
          $set: {
            status: WorkFlowStatus.DELETED,
          },
        },
        {
          new: true,
        },
      );

      if (!result) {
        throw new Error(`workflow folder failed to delete `);
      }
      return result;
    }
  }
}
