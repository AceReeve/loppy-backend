import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronService } from 'src/app/cron/cron.service';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { AbstractLeadRepository } from 'src/app/interface/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@Injectable()
export class LeadRepository implements AbstractLeadRepository {
  constructor(
    @InjectModel(Lead.name)
    private leadModel: Model<Lead & Document>,

    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
    private cronService: CronService,
  ) {}

  async getAllLeads(): Promise<Lead[] | null> {
    return await this.leadModel.find({});
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return await this.leadModel.findById(id);
  }

  async createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null> {
    const { stage_id, ...leadData } = createLeadDto;

    // Create a new lead
    const lead = await this.leadModel.create(leadData);

    if (!lead) {
      throw new Error('Opportunity creation failed');
    }

    // Populate the owner_id field after creation
    const populatedLead = await this.leadModel.findById(lead._id).populate({
      path: 'owner_id',
    });

    // Update the opportunity by pushing the new lead's _id into the leads array
    const updatedOpportunity = await this.opportunityModel.findByIdAndUpdate(
      stage_id,
      { $push: { leads: lead._id } },
      { new: true }, // Return the updated document
    );

    if (!updatedOpportunity) {
      throw new Error(`Stage with id ${stage_id} not found`);
    }

    return populatedLead;
  }

  async updateLead(
    id: string,
    updateLeadDto: CreateLeadDTO,
  ): Promise<Lead | null> {
    const leadDataBefore = await this.leadModel.findById(id);

    const updateLead: any = { ...updateLeadDto };

    // Update old_status only if the status has changed
    if (updateLeadDto.status && updateLeadDto.status !== leadDataBefore.status) {
      updateLead.old_status = leadDataBefore.status;
    }
    
    const lead = await this.leadModel.findByIdAndUpdate(id, updateLead,{
      new: true,
    });

    // Populate the owner_id field after creation
    const populatedLead = await this.leadModel.findById(lead._id).populate({
      path: 'owner_id',
    });
    if(lead){
       await this.cronService.oppportunityStatusChange() 
    }
    return populatedLead;
  }

  async deleteLead(id: string): Promise<any> {
    return await this.leadModel.findByIdAndDelete(id);
  }
}
