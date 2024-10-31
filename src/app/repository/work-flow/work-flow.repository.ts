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
import { WorkFlowAction, WorkFlowStatus } from 'src/app/const/action';
import { WorkFlowType } from 'src/app/const';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';
import { Lead } from 'src/app/models/lead/lead.schema';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';
import { Tags } from 'src/app/models/contacts/contacts.schema';
import { TagsDocument } from 'src/app/models/tags/tags.schema';

@Injectable()
export class WorkFlowRepository implements AbstractWorkFlowRepository {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(WorkFlowFolder.name)
    private workFlowFolderModel: Model<WorkFlowFolderDocument>,
    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
    @InjectModel(Pipeline.name)
    private pipelineModel: Model<Pipeline & Document>,
    @InjectModel(Lead.name)
    private leadModel: Model<Lead & Document>,
    private cronService: CronService,
    private serviceTitan: ServiceTitanService,
    @InjectModel(Tags.name)
    private tagsModel: Model<TagsDocument>,
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

      // // WORKFLOW_ACTION_CREATE_NEW_OPPORTUNITY
      // if (dto.action) {
      //   if (
      //     dto.action.node_name ===
      //     WorkFlowAction.WORKFLOW_ACTION_CREATE_NEW_OPPORTUNITY
      //   ) {
      //     const leadData = {
      //       owner_id: dto.action.content?.owner_id,
      //       stage_id: dto.action.content?.stage_id,
      //       pipeline_id: dto.action.content?.pipeline_id,
      //       primary_contact_name_id:
      //         dto.action.content?.primary_contact_name_id,
      //       opportunity_name: dto.action.content?.opportunity_name,
      //       opportunity_source: dto.action.content?.opportunity_source,
      //       status: dto.action.content?.status,
      //       opportunity_value: dto.action.content?.opportunity_value,
      //     };

      //     const stage_id = dto.action.content?.stage_id;

      //     if (!dto.action.content?._id) {
      //       // Create a new lead
      //       const lead = await this.leadModel.create(leadData);

      //       if (!lead) {
      //         throw new Error('Opportunity creation failed');
      //       }

      //       // Update the opportunity by pushing the new lead's _id into the leads array
      //       const updatedOpportunity =
      //         await this.opportunityModel.findByIdAndUpdate(
      //           stage_id,
      //           { $push: { leads: lead._id } },
      //           { new: true }, // Return the updated document
      //         );

      //       if (!updatedOpportunity) {
      //         throw new Error(`Stage with id ${stage_id} not found`);
      //       }
      //     } else {
      //       // update lead
      //       await this.leadModel.findByIdAndUpdate(
      //         dto.action.content?._id,
      //         leadData,
      //         {
      //           new: true,
      //         },
      //       );
      //     }
      //   }
      // }

      let createWorkFlow;

      // if (dto.folder_id) {
      //   const folder = await this.workFlowFolderModel.findOne({
      //     _id: new Types.ObjectId(dto.folder_id),
      //   });

      //   if (!folder) {
      //     throw new Error(`Workflow folder ${dto.folder_id} not found`);
      //   }

      //   createWorkFlow = await this.workFlowModel.findOneAndUpdate(
      //     {
      //       _id: new Types.ObjectId(id),
      //     },
      //     {
      //       $set: {
      //         name: dto.workflow_name,
      //         created_by: user._id,
      //         folder_id: new Types.ObjectId(id),
      //         trigger: dto.trigger,
      //         action: dto.action,
      //         status: dto.status,
      //       },
      //     },
      //     {
      //       new: true,
      //     },
      //   );
      // } else {
      createWorkFlow = await this.workFlowModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        {
          $set: {
            // name: dto.workflow_name,
            created_by: user._id,
            trigger: dto.trigger,
            action: dto.action,
            // status: dto.status,
          },
        },
        {
          new: true,
        },
      );

      // run cron
      // await this.cronService.handleCron();
      // }
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
  async publishedWorkFlow(id: string, published: Boolean): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();

    if (published === true || published.toString() === 'true') {
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
      // const results = await this.cronService.handleCron();

      return result;
    } else {
      const result = await this.workFlowModel.findOneAndUpdate(
        {
          created_by: user._id,
          _id: new Types.ObjectId(id),
        },
        {
          $set: {
            status: WorkFlowStatus.SAVED,
          },
        },
        {
          new: true,
        },
      );
      if (!result) {
        throw new Error(`workflow failed to published `);
      }
      // const results = await this.cronService.handleCron();

      return result;
    }
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

  async getAllWorkFlowDropDownList(): Promise<any> {
    const user = await this.userRepository.getLoggedInUserDetails();
    const workFlows = await this.workFlowModel.find({
      created_by: user._id,
      status: { $ne: WorkFlowStatus.DELETED },
    });
    const tagsResponse = await this.serviceTitan.getTagTypesv2();
    const tags = tagsResponse.data;
    const formattedWorkFlows = workFlows.map(workFlow => ({
      name: workFlow.name,
      id: workFlow._id
    }));
    const formattedTags = tags.map(tag => ({
      name: tag.name,
      id: tag.id,
    }));
    for(const formattedTag of formattedTags){
      const isExisting = await this.tagsModel.findOne({id: formattedTag.id})
      if(!isExisting){
        const saveTags = new this.tagsModel({
          name: formattedTag.name,
          id: formattedTag.id,
          source: 'Service Titan',
        });
        await saveTags.save();
      }
    }
    return {
      workflows: formattedWorkFlows,
      tags: await this.tagsModel.find(),
    };
  }
}
