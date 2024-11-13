import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { UserInterface } from '../user';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractLeadRepository {
  abstract createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null>;
  abstract getLeadById(id: string): Promise<Lead | null>;
  abstract getAllLeads(): Promise<Lead[] | null>;
  abstract updateLead(
    req: UserInterface,
    id: string,
    updateLeadDto: CreateLeadDTO,
  ): Promise<Lead | null>;
  abstract deleteLead(id: string): Promise<Lead | null>;
  abstract updateOpportunityStatus(
    req: UserInterface,
    id: string,
    status: string,
  ): Promise<Lead | null>;
}

export abstract class AbstractLeadService {
  abstract createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null>;
  abstract getLeadById(id: string): Promise<Lead | null>;
  abstract getAllLeads(): Promise<Lead[] | null>;
  abstract updateLead(
    req: UserInterface,
    id: string,
    updateLeadDto: CreateLeadDTO,
  ): Promise<Lead | null>;
  abstract deleteLead(id: string): Promise<Lead | null>;
  abstract updateOpportunityStatus(
    req: UserInterface,
    id: string,
    status: string,
  ): Promise<Lead | null>;
}
