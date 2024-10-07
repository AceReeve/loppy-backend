import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateOpportunityDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { AbstractOpportunityRepository } from 'src/app/interface/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@Injectable()
export class OpportunityRepository implements AbstractOpportunityRepository {
  constructor(
    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
  ) {}

  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.opportunityModel
      .find({})
      .populate('leads')
      .sort({ itemOrder: 1 })
      .exec();
  }
  async createOpportunity(
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.opportunityModel.create(createOpportunityDto);
  }

  async updateOpportunities(
    updateOpportunityDto: UpdateOpportunityDTO[],
  ): Promise<Opportunity[] | null> {
    const updatedOpportunities: Opportunity[] = [];

    for (const opportunityData of updateOpportunityDto) {
      const { _id, ...updateFields } = opportunityData;

      const updatedOpportunity = await this.opportunityModel
        .findByIdAndUpdate(_id, { $set: updateFields }, { new: true })
        .exec();

      if (updatedOpportunity) {
        updatedOpportunities.push(updatedOpportunity);
      }
    }

    return updatedOpportunities.length > 0 ? updatedOpportunities : null;
  }

  async updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null> {
    try {
      console.log(id);
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
