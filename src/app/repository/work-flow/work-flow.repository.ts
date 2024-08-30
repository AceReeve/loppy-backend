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
import { CreateWorkflowDto } from 'src/app/dto/work-flow';

@Injectable()
export class WorkFlowRepository implements AbstractWorkFlowRepository {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(WorkFlowFolder.name)
    private workFlowFolderModel: Model<WorkFlowFolderDocument>,
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
        work_flow_name: uniqueName,
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
          work_flow_name: generatedName,
          created_by: user._id,
          folder_id: new Types.ObjectId(id),
          trigger: dto.triger,
          action: dto.action,
        });
      } else {
        createWorkFlow = new this.workFlowModel({
          work_flow_name: generatedName,
          created_by: user._id,
          trigger: dto.triger,
          action: dto.action,
        });
      }
      const savedWorkflow = await createWorkFlow.save();
      return savedWorkflow;
    } catch (error) {
      throw new Error(`Error in workFlow method: ${error.message}`);
    }
  }

  async getAllWorkFlow(folder_id: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const workflow = await this.workFlowModel.find({
      created_by: user._id,
      folder_id: new Types.ObjectId(folder_id),
    });
    return workflow;
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

  async updateWorkFlowById(id: string, work_flow_name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateWorkFlowName = await this.workFlowModel.findOne({
      created_by: user._id,
      work_flow_name: work_flow_name,
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
          work_flow_name: work_flow_name,
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

  //folder
  async folder(folder_name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateFolderName = await this.workFlowFolderModel.findOne({
      folder_name: folder_name,
      created_by: user._id,
    });
    if (validateFolderName) {
      throw new Error(`folder  ${validateFolderName} is already exist `);
    }
    const createWorkFlowFolder = new this.workFlowFolderModel({
      folder_name: folder_name,
      created_by: user._id,
    });
    return await createWorkFlowFolder.save();
  }

  async getAllFolder(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const workflow = await this.workFlowFolderModel.find({
      created_by: user._id,
    });
    return workflow;
  }

  async getFolderById(id: string): Promise<any> {
    const result = await this.workFlowFolderModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new Error(`workflow folder with the ID: ${id} not found `);
    }
    return result;
  }

  async updateFolderById(id: string, folder_name: string): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const validateWorkFlowName = await this.workFlowFolderModel.findOne({
      created_by: user._id,
      folder_name: folder_name,
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
          folder_name: folder_name,
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
}
