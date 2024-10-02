import { Injectable } from '@nestjs/common';
import {
  AbstractLeadRepository,
  AbstractLeadService,
} from 'src/app/interface/lead';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';

@Injectable()
export class LeadService implements AbstractLeadService {
  constructor(private readonly repository: AbstractLeadRepository) {}

  async getAllLeads(): Promise<Lead[] | null> {
    return await this.repository.getAllLeads();
  }
  async createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null> {
    return await this.repository.createLead(createLeadDto);
  }
}
