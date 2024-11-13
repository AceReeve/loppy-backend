import { Injectable } from '@nestjs/common';
import {
  AbstractLeadRepository,
  AbstractLeadService,
} from 'src/app/interface/lead';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { UserInterface } from 'src/app/interface/user';

@Injectable()
export class LeadService implements AbstractLeadService {
  constructor(private readonly repository: AbstractLeadRepository) {}

  async getAllLeads(): Promise<Lead[] | null> {
    return await this.repository.getAllLeads();
  }

  async updateOpportunityStatus(
    req: UserInterface,
    id: string,
    status: string,
  ): Promise<Lead | null> {
    return await this.repository.updateOpportunityStatus(req, id, status);
  }
  
  async getLeadById(id: string): Promise<Lead | null> {
    return await this.repository.getLeadById(id);
  }

  async createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null> {
    return await this.repository.createLead(createLeadDto);
  }

  async updateLead(
    req: UserInterface,
    id: string,
    updateLeadDto: CreateLeadDTO,
  ): Promise<Lead | null> {
    return await this.repository.updateLead(req, id, updateLeadDto);
  }

  async deleteLead(id: string): Promise<Lead | null> {
    return await this.repository.deleteLead(id);
  }
}
