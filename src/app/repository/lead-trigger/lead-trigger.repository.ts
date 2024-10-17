import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadTriggerDTO } from 'src/app/dto/lead-trigger';
import { AbstractLeadTriggerRepository } from 'src/app/interface/lead-trigger';
import { LeadTrigger } from 'src/app/models/lead-trigger/lead-trigger.schema';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@Injectable()
export class LeadTriggerRepository implements AbstractLeadTriggerRepository {
  constructor(
    @InjectModel(LeadTrigger.name)
    private leadModel: Model<LeadTrigger & Document>,

    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
  ) {}

  async getLeadTriggerById(id: string): Promise<LeadTrigger | null> {
    return await this.leadModel.findById(id);
  }

  async createLeadTrigger(
    createLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    // Create a new lead
    const lead = await this.leadModel.create(createLeadDto);

    return lead;
  }

  async updateLeadTrigger(
    id: string,
    updateLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    return await this.leadModel.findByIdAndUpdate(id, updateLeadDto, {
      new: true,
    });
  }

  async deleteLeadTrigger(id: string): Promise<any> {
    return await this.leadModel.findByIdAndDelete(id);
  }
}
