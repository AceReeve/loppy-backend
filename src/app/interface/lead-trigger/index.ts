import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { CreateLeadTriggerDTO } from 'src/app/dto/lead-trigger';
import { LeadTrigger } from 'src/app/models/lead-trigger/lead-trigger.schema';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractLeadTriggerRepository {
  abstract createLeadTrigger(
    createLeadTriggerDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null>;
  abstract getLeadTriggerById(id: string): Promise<LeadTrigger | null>;
  abstract updateLeadTrigger(
    id: string,
    updateLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null>;
  abstract deleteLeadTrigger(id: string): Promise<LeadTrigger | null>;
}

export abstract class AbstractLeadTriggerService {
  abstract createLeadTrigger(
    createLeadTriggerDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null>;
  abstract getLeadTriggerById(id: string): Promise<LeadTrigger | null>;
  abstract updateLeadTrigger(
    id: string,
    updateLeadDto: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null>;
  abstract deleteLeadTrigger(id: string): Promise<LeadTrigger | null>;
}
