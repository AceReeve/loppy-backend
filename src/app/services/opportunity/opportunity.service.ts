import { Injectable } from '@nestjs/common';
import {
  AbstractOpportunityRepository,
  AbstractOpportunityService,
} from 'src/app/interface/opportunity';
import {
  CreateOpportunityDTO,
  UpdateOpportunitiesDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@Injectable()
export class OpportunityService implements AbstractOpportunityService {
  constructor(private readonly repository: AbstractOpportunityRepository) {}

  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.repository.getAllOpportunities();
  }
  async createOpportunity(
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.repository.createOpportunity(createOpportunityDto);
  }

  async updateOpportunities(
    updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[] | null> {
    return await this.repository.updateOpportunities(updateOpportunityDto);
  }

  async updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.repository.updateOpportunity(id, updateOpportunityDto);
  }

  async deleteOpportunity(id: string): Promise<Opportunity | null> {
    return await this.repository.deleteOpportunity(id);
  }

  async getAllOpportunitiesPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<any> {
    return await this.repository.getAllOpportunitiesPaginated(
      page,
      limit,
      search,
    );
  }
}
