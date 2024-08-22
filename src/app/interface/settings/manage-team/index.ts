import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';

export abstract class AbstractManageTeamRepository {
  abstract createTeam(createTeamDTO: CreateTeamDTO): Promise<any>;
  abstract inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any>;
  abstract getAllTeam(): Promise<any>;
  abstract getTeam(id: string): Promise<any>;
  abstract customRole(customRoleDTO: CustomRoleDTO): Promise<any>;
  abstract getAllRole(team_id: string): Promise<any>;
  abstract getRole(id: string): Promise<any>;
}

export abstract class AbstractManageTeamService {
  abstract createTeam(createTeamDTO: CreateTeamDTO): Promise<any>;
  abstract inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any>;
  abstract getAllTeam(): Promise<any>;
  abstract getTeam(id: string): Promise<any>;
  abstract customRole(customRoleDTO: CustomRoleDTO): Promise<any>;
  abstract getAllRole(team_id: string): Promise<any>;
  abstract getRole(id: string): Promise<any>;
}
