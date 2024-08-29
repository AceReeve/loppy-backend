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

@Injectable()
export class WorkFlowRepository implements AbstractWorkFlowRepository {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
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

  async workFlow(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();

    // Generate a unique name
    const generatedName = await this.generateUniqueName.call(this);
    const createWorkFlow = new this.workFlowModel({
      work_flow_name: generatedName,
      created_by: user._id,
    });
    return await createWorkFlow.save();
  }

  async getAllWorkFlow(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const organizations = await this.workFlowModel.find({
      created_by: user._id,
    });
    return organizations;
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
}
