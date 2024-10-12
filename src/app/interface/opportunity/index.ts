import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import {
  CreateOpportunityDTO,
  UpdateOpportunitiesDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractOpportunityRepository {
  abstract createOpportunity(
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity | null>;
  abstract getAllOpportunities(): Promise<Opportunity[] | null>;
  abstract updateOpportunities(
    updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[] | null>;
  abstract updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null>;
  abstract deleteOpportunity(id: string): Promise<Opportunity | null>;
}

export abstract class AbstractOpportunityService {
  abstract createOpportunity(
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity | null>;
  abstract getAllOpportunities(): Promise<Opportunity[] | null>;
  abstract updateOpportunities(
    updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[] | null>;
  abstract updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null>;
  abstract deleteOpportunity(id: string): Promise<Opportunity | null>;
}
