import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateOpportunityDTO,
  UpdateOpportunitiesDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { AbstractOpportunityRepository } from 'src/app/interface/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';
import { Pipeline } from 'src/app/models/pipeline/pipeline.schema';

@Injectable()
export class OpportunityRepository implements AbstractOpportunityRepository {
  constructor(
    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,

    @InjectModel(Pipeline.name)
    private pipelineModel: Model<Pipeline & Document>,
  ) {}

  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.opportunityModel.find({}).populate('leads').exec();
  }
  async createOpportunity(
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    // return await this.opportunityModel.create(createOpportunityDto);

    const { pipeline_id, ...opportunityData } = createOpportunityDto;

    // Create a new lead
    const opportunity = await this.opportunityModel.create(opportunityData);

    if (!opportunity) {
      throw new Error('Opportunity creation failed');
    }

    // Update the opportunity by pushing the new opportunity's _id into the opportunitys array
    const updatedOpportunity = await this.pipelineModel.findByIdAndUpdate(
      pipeline_id,
      { $push: { opportunities: opportunity._id } },
      { new: true }, // Return the updated document
    );

    if (!updatedOpportunity) {
      throw new Error(`Opportunity with id ${pipeline_id} not found`);
    }

    return opportunity;
  }

  async updateOpportunities(
    updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[] | null> {
    const updatedOpportunities: Opportunity[] = [];

    for (const opportunityData of updateOpportunityDto.updated_items) {
      const { _id, ...updateFields } = opportunityData;

      const updatedOpportunity = await this.opportunityModel
        .findByIdAndUpdate(_id, { $set: updateFields }, { new: true })
        .exec();

      if (updatedOpportunity) {
        updatedOpportunities.push(updatedOpportunity);
      }
    }

    // update the pipeline opportunities
    await this.pipelineModel
      .findByIdAndUpdate(updateOpportunityDto.pipeline_id, {
        $set: { opportunities: updateOpportunityDto.pipeline_opportunities },
      })
      .exec();

    return updatedOpportunities.length > 0 ? updatedOpportunities : null;
  }

  async updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null> {
    try {
      // console.log(id);
      const opportunity = await this.opportunityModel
        .findByIdAndUpdate(id, updateOpportunityDto, { new: true })
        .exec();

      return opportunity;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async deleteOpportunity(id: string): Promise<Opportunity | null> {
    return await this.opportunityModel.findByIdAndDelete(id).exec();
  }
}
