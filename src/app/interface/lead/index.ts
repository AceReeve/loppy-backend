import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractLeadRepository {
  abstract createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null>;
  abstract getAllLeads(): Promise<Lead[] | null>;
}

export abstract class AbstractLeadService {
  abstract createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null>;
  abstract getAllLeads(): Promise<Lead[] | null>;
}
