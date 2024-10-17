import { Injectable } from '@nestjs/common';
import { CreateLeadTriggerDTO } from 'src/app/dto/lead-trigger';
import {
  AbstractLeadTriggerRepository,
  AbstractLeadTriggerService,
} from 'src/app/interface/lead-trigger';
import { LeadTrigger } from 'src/app/models/lead-trigger/lead-trigger.schema';

@Injectable()
export class LeadTriggerService implements AbstractLeadTriggerService {
  constructor(private readonly repository: AbstractLeadTriggerRepository) {}

  async getLeadTriggerById(id: string): Promise<LeadTrigger | null> {
    return await this.repository.getLeadTriggerById(id);
  }

  async createLeadTrigger(
    createLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    return await this.repository.createLeadTrigger(createLeadDto);
  }

  async updateLeadTrigger(
    id: string,
    updateLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    return await this.repository.updateLeadTrigger(id, updateLeadDto);
  }

  async deleteLeadTrigger(id: string): Promise<LeadTrigger | null> {
    return await this.repository.deleteLeadTrigger(id);
  }
}
